import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: 'Work', description: 'Professional tasks, meetings, deliverables, communications', color: 'teal', sortOrder: 1 },
  { name: 'Academics', description: 'Assignments, readings, coursework, exams, deadlines', color: 'lavender', sortOrder: 2 },
  { name: 'Personal', description: 'Errands, household, relationships, finances', color: 'blue', sortOrder: 3 },
  { name: 'Well-being', description: 'Meditation, exercise, rest, self-care', color: 'green', sortOrder: 4 },
];

async function main() {
  const email = process.env.DEFAULT_USER_EMAIL || 'demo@notton.ai';
  const fixedId = process.env.DEFAULT_USER_ID;

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { id: fixedId || randomUUID(), email },
  });

  await prisma.task.deleteMany({ where: { userId: user.id, archivedAt: { not: null } } });

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
