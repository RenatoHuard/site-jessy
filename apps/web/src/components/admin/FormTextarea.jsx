
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function FormTextarea({ label, id, value, onChange, placeholder, rows = 4, required = false }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Textarea
        id={id}
        name={id}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="bg-background text-foreground resize-y"
      />
    </div>
  );
}
