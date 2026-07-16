
import React from 'react';

export default function AdminSplitLayout({ formContent, previewContent, title }) {
  return (
    <div className="admin-split-container">
      {/* Left Side: Form Area */}
      <div className="admin-split-form custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          {title && <h1 className="admin-title">{title}</h1>}
          {formContent}
        </div>
      </div>

      {/* Right Side: Live Preview Area */}
      <div className="admin-split-preview custom-scrollbar">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex justify-between items-center shadow-sm">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Live Preview
          </span>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-accent/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-secondary/80"></span>
          </div>
        </div>
        <div className="admin-preview-wrapper pointer-events-none select-none origin-top">
          {previewContent}
        </div>
      </div>
    </div>
  );
}
