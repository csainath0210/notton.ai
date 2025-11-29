import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
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
        <button className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-white/70 transition-all group min-h-[400px] flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
            <Plus className="w-8 h-8 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <div className="text-center">
            <h3 className="text-slate-700 group-hover:text-slate-900 transition-colors mb-1">
              Add New Category
            </h3>
            <p className="text-slate-500">
              Create a custom task category
            </p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              placeholder="e.g., Side Projects, Health, Learning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Choose a Color</Label>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-full aspect-square rounded-xl ${color.class} hover:scale-110 transition-transform ${
                    selectedColor === color.value
                      ? 'ring-4 ring-offset-2 ring-slate-400'
                      : 'hover:ring-2 ring-offset-2 ring-slate-300'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
