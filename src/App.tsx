import * as styles from "./App.module.css";
import { MoonIcon, SunIcon, WaveIcon } from "./IntroIcons";
import LightBulb from "./LightBulb";
import Pool from "./Pool";
import Title, { TITLE_ENTRANCE_STEPS } from "./Title";
import Toast from "./Toast";
import VersionSwitcher from "./VersionSwitcher";

const UNDER_CONSTRUCTION_TOAST_ID = "under-construction-toast";

export default function App() {
  return (
    <div
      className={styles.app}
      style={{ "--title-entrance-steps": TITLE_ENTRANCE_STEPS }}
    >
      <Title />
      <p className={styles.intro}>
        {/* Each icon is kept on the same line as the words before it. */}
        <span className={styles.nowrap}>
          <span className={styles.greeting}>Hi there!</span>{" "}
          <WaveIcon className={`${styles.icon} ${styles.wave}`} />
        </span>{" "}
        I am an engineer &amp; product thinker{" "}
        <span className={styles.nowrap}>
          by day <SunIcon className={`${styles.icon} ${styles.sun}`} />
        </span>
        , and a fitness instructor &amp; creative{" "}
        <span className={styles.nowrap}>
          by night <MoonIcon className={styles.icon} />
        </span>
        . My mission in life is to bring people joy by living with joy
        <span className={styles["wide-only"]}>
          , whether through meaningful work, mentorship and community building,
          or my dance-party cycling classes
        </span>
        !
      </p>
      {/* Lowercase attributes: React 18 has no popover support and passes these through as-is. */}
      <button
        type="button"
        className={styles.cta}
        popovertarget={UNDER_CONSTRUCTION_TOAST_ID}
        popovertargetaction="show"
      >
        Let’s dive in
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </button>
      <Pool />
      <LightBulb />
      <VersionSwitcher />
      <Toast id={UNDER_CONSTRUCTION_TOAST_ID} message="Under construction!" />
    </div>
  );
}
