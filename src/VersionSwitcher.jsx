import * as styles from './VersionSwitcher.module.css';
import { versions } from './versions';

const CURRENT_MAJOR = Number(versions.current.split('.')[0]);

// The menu is a native popover, so the browser owns open state, outside-click and
// Escape dismissal, and focus return; there is no React state here.
export default function VersionSwitcher() {
  return (
    <div className={styles.root}>
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
