import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AddCategoryCardProps {
  onAddCategory: (category: { title: string; color: string }) => void;
}

const colorOptions = [
  { name: 'Teal', value: 'teal', class: 'bg-teal-400' },
  { name: 'Lavender', value: 'lavender', class: 'bg-purple-400' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-400' },
  { name: 'Green', value: 'green', class: 'bg-green-400' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-400' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-400' },
];

export function AddCategoryCard({ onAddCategory }: AddCategoryCardProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('teal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddCategory({ title, color: selectedColor });
      setTitle('');
      setSelectedColor('teal');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all group min-h-[400px] flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 flex items-center justify-center transition-colors">
            <Plus className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          </div>
          <div className="text-center">
            <h3 className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors mb-1">
              Add New Category
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Create a custom task category
            </p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">Create New Category</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">Add a new category to organize your tasks.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="category-name" className="text-slate-700 dark:text-slate-300">Category Name</Label>
            <Input
              id="category-name"
              placeholder="e.g., Side Projects, Health, Learning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-slate-700 dark:text-slate-300">Choose a Color</Label>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-full aspect-square rounded-xl ${color.class} hover:scale-110 transition-transform ${
                    selectedColor === color.value
                      ? 'ring-4 ring-offset-2 dark:ring-offset-slate-800 ring-slate-400 dark:ring-slate-500'
                      : 'hover:ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-slate-300 dark:ring-slate-600'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white">
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}