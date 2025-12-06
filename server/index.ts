import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, AuditAction, EnergyLevel, Source } from '@prisma/client';
import { z } from 'zod';

dotenv.config();

if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.error('DATABASE_URL is not set. Please provide it in the environment.');
  process.exit(1);
}

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 4000;
const DEFAULT_USER_EMAIL = process.env.DEFAULT_USER_EMAIL || 'demo@notton.ai';
const SHOULD_SEED = process.env.SEED_ON_START !== 'false';

async function getUserId(): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) {
    throw new Error('Default user not found. Seed the database first.');
  }
  return user.id;
}

async function logAudit(userId: string, action: AuditAction, taskId?: string, payload?: unknown) {
  await prisma.auditLog.create({
    data: { userId, taskId, action, payload },
  });
}

// GET /categories
app.get('/categories', async (_req, res) => {
  try {
    const userId = await getUserId();
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
      include: {
        tasks: {
          where: { archivedAt: null },
          select: { id: true, inToday: true, completed: true },
        },
      },
    });

    const response = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      isDefault: category.isDefault,
      sortOrder: category.sortOrder,
      counts: {
        total: category.tasks.length,
        inToday: category.tasks.filter((t) => t.inToday).length,
        completed: category.tasks.filter((t) => t.completed).length,
      },
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /categories
app.post('/categories', async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    color: z.string().min(1),
    sortOrder: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  try {
    const userId = await getUserId();
    const category = await prisma.category.create({
      data: { ...parsed.data, isDefault: false, userId },
    });
    await logAudit(userId, AuditAction.create_category, undefined, { categoryId: category.id });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// DELETE /categories/:id
app.delete('/categories/:id', async (req, res) => {
  try {
    const userId = await getUserId();
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (category.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this category' });
    }

    if (category.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default categories' });
    }

    // Delete the category (tasks will be cascade deleted due to onDelete: Cascade in schema)
    await prisma.category.delete({
      where: { id: req.params.id },
    });

    await logAudit(userId, AuditAction.update_category, undefined, { categoryId: category.id, action: 'delete' });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// GET /tasks?category_id=...
app.get('/tasks', async (req, res) => {
  const categoryId = req.query.category_id as string | undefined;
  try {
    const userId = await getUserId();
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        archivedAt: null,
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /tasks
app.post('/tasks', async (req, res) => {
  const durationSchema = z
    .union([
      z.enum(['15', '30', '60', '120']).transform(Number),
      z.number().int().refine((v) => [15, 30, 60, 120].includes(v), 'Duration must be 15, 30, 60, or 120'),
    ])
    .transform((v) => (typeof v === 'string' ? Number(v) : v));

  const schema = z.object({
    title: z.string().min(1),
    categoryId: z.string().uuid(),
    durationMinutes: durationSchema,
    energyLevel: z.nativeEnum(EnergyLevel),
    source: z.nativeEnum(Source),
    addToToday: z.boolean().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  try {
    const userId = await getUserId();
    const { addToToday, ...rest } = parsed.data;

    // Determine the next today position if adding to Today
    let todayPosition: number | null = null;
    if (addToToday) {
      const maxPos = await prisma.task.aggregate({
        where: { userId, inToday: true, archivedAt: null },
        _max: { todayPosition: true },
      });
      todayPosition = (maxPos._max.todayPosition || 0) + 1;
    }

    const task = await prisma.task.create({
      data: {
        ...rest,
        inToday: Boolean(addToToday),
        todayPosition,
        userId,
      },
    });
    await logAudit(userId, AuditAction.create_task, task.id, rest);
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PATCH /tasks/:id
app.patch('/tasks/:id', async (req, res) => {
  const durationSchema = z
    .union([
      z.enum(['15', '30', '60', '120']).transform(Number),
      z.number().int().refine((v) => [15, 30, 60, 120].includes(v), 'Duration must be 15, 30, 60, or 120'),
    ])
    .transform((v) => (typeof v === 'string' ? Number(v) : v));

  const schema = z.object({
    title: z.string().min(1).optional(),
    categoryId: z.string().uuid().optional(),
    durationMinutes: durationSchema.optional(),
    energyLevel: z.nativeEnum(EnergyLevel).optional(),
    source: z.nativeEnum(Source).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  try {
    const userId = await getUserId();
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    await logAudit(userId, AuditAction.update_task, task.id, parsed.data);
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PATCH /tasks/:id/today
app.patch('/tasks/:id/today', async (req, res) => {
  const schema = z.object({
    inToday: z.boolean(),
    todayPosition: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  try {
    const userId = await getUserId();
    let data;
    if (parsed.data.inToday) {
      const maxPos = await prisma.task.aggregate({
        where: { userId, inToday: true, archivedAt: null },
        _max: { todayPosition: true },
      });
      const nextPos = (maxPos._max.todayPosition || 0) + 1;
      data = { inToday: true, todayPosition: parsed.data.todayPosition ?? nextPos };
    } else {
      data = { inToday: false, todayPosition: null };
    }
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data,
    });
    await logAudit(userId, parsed.data.inToday ? AuditAction.add_to_today : AuditAction.remove_from_today, task.id, data);
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update today status' });
  }
});

// POST /today/reorder
app.post('/today/reorder', async (req, res) => {
  const schema = z.object({
    taskIds: z.array(z.string().uuid()),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  try {
    const userId = await getUserId();
    await prisma.$transaction(
      parsed.data.taskIds.map((taskId, idx) =>
        prisma.task.update({
          where: { id: taskId },
          data: { todayPosition: idx + 1 },
        })
      )
    );
    await logAudit(userId, AuditAction.update_task, undefined, { reordered: parsed.data.taskIds });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder today tasks' });
  }
});

// PATCH /tasks/:id/complete
app.patch('/tasks/:id/complete', async (req, res) => {
  const schema = z.object({
    completed: z.boolean(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  try {
    const userId = await getUserId();
    const data = parsed.data.completed
      ? { completed: true, inToday: false, todayPosition: null }
      : { completed: false };
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data,
    });
    await logAudit(userId, parsed.data.completed ? AuditAction.complete_task : AuditAction.reopen_task, task.id, data);
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update completion' });
  }
});

// GET /today
app.get('/today', async (_req, res) => {
  try {
    const userId = await getUserId();
    const tasks = await prisma.task.findMany({
      where: { userId, inToday: true, archivedAt: null },
      orderBy: [{ todayPosition: 'asc' }],
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch today tasks' });
  }
});

// PATCH /tasks/:id/archive
app.patch('/tasks/:id/archive', async (req, res) => {
  try {
    const userId = await getUserId();
    const result = await prisma.task.updateMany({
      where: { id: req.params.id, userId },
      data: { archivedAt: new Date(), inToday: false, todayPosition: null },
    });
    if (result.count === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await logAudit(userId, AuditAction.archive_task, req.params.id, {});
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to archive task' });
  }
});

// Auto-seed on startup if user doesn't exist or has no default categories
async function ensureSeeded() {
  try {
    const { randomUUID } = await import('node:crypto');
    const email = process.env.DEFAULT_USER_EMAIL || 'demo@notton.ai';
    const fixedId = process.env.DEFAULT_USER_ID;

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('No user found. Creating default user...');
      user = await prisma.user.create({
        data: { id: fixedId || randomUUID(), email },
      });
    }

    // Check if default categories exist
    const categories = await prisma.category.findMany({
      where: { userId: user.id, isDefault: true },
    });

    if (categories.length === 0) {
      console.log('No default categories found. Seeding database...');
      const DEFAULT_CATEGORIES = [
        { name: 'Work', description: 'Professional tasks, meetings, deliverables, communications', color: 'teal', sortOrder: 1 },
        { name: 'Academics', description: 'Assignments, readings, coursework, exams, deadlines', color: 'lavender', sortOrder: 2 },
        { name: 'Personal', description: 'Errands, household, relationships, finances', color: 'blue', sortOrder: 3 },
        { name: 'Well-being', description: 'Meditation, exercise, rest, self-care', color: 'green', sortOrder: 4 },
      ];

      for (const cat of DEFAULT_CATEGORIES) {
        await prisma.category.upsert({
          where: { userId_name: { userId: user.id, name: cat.name } },
          update: {},
          create: {
            ...cat,
            isDefault: true,
            userId: user.id,
          },
        });
      }
      console.log('Database seeded successfully with default categories');
    } else {
      console.log(`Found ${categories.length} default categories`);
    }
  } catch (error) {
    console.error('Error during seeding:', error);
    // Don't exit - let the server start and try again on first request
  }
}

// Start server
app.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`API running on port ${PORT}`);
  if (SHOULD_SEED) {
    await ensureSeeded();
  } else {
    console.log('Skipping seed on start (SEED_ON_START=false)');
  }
});
