
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function FormField({ label, id, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-background text-foreground"
      />
    </div>
  );
}
