import * as styles from './App.module.css';
import Pool from './Pool';
import Title from './Title';
import VersionSwitcher from './VersionSwitcher';

export default function App() {
  return (
    <div className={styles.app}>
      <Title />
      <p className={styles.message}>Under construction, come back soon</p>
      <Pool />
      <VersionSwitcher />
    </div>
  );
}
