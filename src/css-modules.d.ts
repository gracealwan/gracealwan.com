// css-loader emits each class as a named export, consumed via `import * as styles`.
declare module '*.module.css' {
  const classNames: { readonly [className: string]: string };
  export = classNames;
}

declare module '*.css';
