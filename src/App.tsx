import * as styles from './App.module.css';
import LightBulb from './LightBulb';
import Pool from './Pool';
import Title from './Title';
import VersionSwitcher from './VersionSwitcher';

export default function App() {
  return (
    <div className={styles.app}>
      <Title />
      <p className={styles.message}>Under construction, come back soon</p>
      <Pool />
      <LightBulb />
      <VersionSwitcher />
    </div>
  );
}
