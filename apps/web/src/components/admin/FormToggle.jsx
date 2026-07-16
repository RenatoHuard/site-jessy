
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function FormToggle({ label, id, checked, onChange }) {
  return (
    <div className="flex items-center space-x-2 pt-2">
      <Switch
        id={id}
        checked={!!checked}
        onCheckedChange={(val) => onChange({ target: { name: id, value: val, type: 'checkbox', checked: val } })}
      />
      <Label htmlFor={id} className="cursor-pointer">{label}</Label>
    </div>
  );
}
