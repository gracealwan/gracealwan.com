import * as styles from './Toast.module.css';

const VISIBLE_MS = 2400;

interface ToastProps {
  id: string;
  message: string;
}

// A manual popover, so a button opens it declaratively with
// popovertarget={id} popovertargetaction="show" and there is no React state.
// The toast only owns dismissing itself after a moment.
export default function Toast({ id, message }: ToastProps) {
  function autoHide(toast: HTMLDivElement | null) {
    if (!toast) return;
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;
    toast.addEventListener('toggle', (event) => {
      clearTimeout(hideTimeout);
      if ((event as ToggleEvent).newState !== 'open') return;
      hideTimeout = setTimeout(() => toast.hidePopover(), VISIBLE_MS);
    });
  }

  return (
    <div id={id} ref={autoHide} className={styles.toast} popover="manual" role="status">
      {message}
    </div>
  );
}
