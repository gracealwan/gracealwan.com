import 'react';

// React 18's types predate the Popover API and don't allow CSS custom properties in `style`.
declare module 'react' {
  interface CSSProperties {
    [customProperty: `--${string}`]: string | number;
  }

  interface HTMLAttributes<T> {
    popover?: 'auto' | 'manual';
  }

  interface ButtonHTMLAttributes<T> {
    popovertarget?: string;
  }
}
