import * as styles from './App.module.css';
import VersionSwitcher from './VersionSwitcher';

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.message}>
        Oh hey!<br />Under construction...
      </div>
      <VersionSwitcher />
    </div>
  );
}
