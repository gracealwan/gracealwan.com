import { useRef, type PointerEvent } from 'react';
import * as styles from './VersionSwitcher.module.css';
import { versions } from './versions';

const CURRENT_MAJOR = Number(versions.current.split('.')[0]);
// Grace period so a diagonal move that clips the corner between trigger and menu
// doesn't dismiss it.
const CLOSE_DELAY_MS = 150;

// The menu is a native popover, so the browser owns open state, outside-click and
// Escape dismissal, and focus return; there is no React state here.
export default function VersionSwitcher() {
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  // The popover stays a DOM child of .root, so pointerleave only fires once the cursor
  // has left both the trigger and the menu, even though the menu renders in the top layer.
  function scheduleClose(event: PointerEvent<HTMLDivElement>) {
    // Touch pointers leave on every tap release, which would close the menu as it opens.
    if (event.pointerType === 'touch') return;
    const menu = event.currentTarget.querySelector<HTMLElement>('[popover]');
    if (!menu) return;
    closeTimeout.current = setTimeout(() => {
      if (menu.matches(':popover-open')) menu.hidePopover();
    }, CLOSE_DELAY_MS);
  }

  function cancelClose() {
    clearTimeout(closeTimeout.current);
  }

  return (
    <div className={styles.root} onPointerEnter={cancelClose} onPointerLeave={scheduleClose}>
      {/* Lowercase attributes: React 18 has no popover support and passes these through as-is. */}
      <button type="button" className={styles.trigger} popovertarget="version-menu">
        v{versions.current}
      </button>
      <ul id="version-menu" className={styles.menu} popover="auto">
        {versions.majors.map(({ major, version, url }, index) => (
          <li key={major} className={styles.item} style={{ '--i': index }}>
            {major === CURRENT_MAJOR ? (
              <span className={styles.current} aria-current="true">
                v{version}
              </span>
            ) : (
              <a href={url} className={styles.link}>
                v{version}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
