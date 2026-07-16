
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function FormColorPicker({ label, id, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-3">
        <Input
          type="color"
          id={id}
          name={id}
          value={value || '#000000'}
          onChange={onChange}
          className="w-16 h-10 p-1 cursor-pointer"
        />
        <Input
          type="text"
          value={value || ''}
          onChange={onChange}
          name={id}
          placeholder="#000000"
          className="flex-1 uppercase"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
    </div>
  );
}
