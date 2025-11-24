import React from 'react';
import { Maximize2, Minus } from 'lucide-react';

interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onTouchEnd?: React.TouchEventHandler;
}

export const TerminalWindow = React.forwardRef<HTMLDivElement, TerminalWindowProps>(
  ({ title, children, className, style, onMouseDown, onMouseUp, onTouchEnd, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        className={`cyber-window flex flex-col overflow-hidden ${className}`}
        {...props}
      >
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cosmic-cyan opacity-50"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cosmic-cyan opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cosmic-cyan opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cosmic-cyan opacity-50"></div>

        <div className="cyber-header grid-drag-handle group">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cosmic-cyan rotate-45 group-hover:animate-spin"></div>
            <span className="text-glow-cyan tracking-widest">{title}</span>
          </div>
          <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
             <Minus size={14} className="cursor-pointer hover:text-white" />
             <Maximize2 size={14} className="cursor-pointer hover:text-white" />
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden relative bg-black/20">
          {children}
        </div>
      </div>
    );
  }
);
