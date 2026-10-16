import * as styles from './Title.module.css';

const NAME = 'Grace Alwan';

// Each letter is its own key so the entrance can type them in one by one. Indexes are
// positions in NAME, so the space between words takes a beat, like hitting the spacebar.
const WORDS = NAME.split(' ').map((word, wordIndex, words) => {
  const start = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0);
  return { start, keys: [...word].map((letter, offset) => ({ letter, index: start + offset })) };
});

// A clicked or tapped key blips down, launches, does a sideways somersault in the air,
// and lands with a small squash. The jump and the spin are separate animations so the
// spin can whip around from takeoff while the jump eases like gravity.
const FLIP_ID = 'flip';
const FLIP_DURATION_MS = 520;
// Moments in the flip, as fractions of its duration. The crouch is a short blip so the
// launch feels immediate.
const FLIP_TAKEOFF = 0.06;
const FLIP_APEX = 0.4;
const FLIP_LANDING = 0.8;
const FLIP_SETTLE = 0.88;
const FLIP_HEIGHT = '-0.55em';
const FLIP_CROUCH = 'scaleY(0.88)';
const FLIP_LANDING_SQUASH = 'scaleY(0.9)';
const EASE_OUT = 'ease-out';
const EASE_OUT_QUINT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_IN_QUAD = 'cubic-bezier(0.11, 0, 0.5, 0)';
const EASE_OUT_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
// Starts fast and eases into the landing; an ease-in start made the flip feel slow.
const SPIN_EASING = 'cubic-bezier(0.25, 0.6, 0.3, 1)';

// Keys squash from their bottom edge (transform-origin in the stylesheet), so the
// crouch and landing do too.
const JUMP_KEYFRAMES: Keyframe[] = [
  { offset: 0, transform: 'translateY(0) scaleY(1)', easing: EASE_OUT },
  { offset: FLIP_TAKEOFF, transform: `translateY(0) ${FLIP_CROUCH}`, easing: EASE_OUT_QUINT },
  { offset: FLIP_APEX, transform: `translateY(${FLIP_HEIGHT}) scaleY(1)`, easing: EASE_IN_QUAD },
  { offset: FLIP_LANDING, transform: 'translateY(0) scaleY(1)', easing: EASE_OUT },
  { offset: FLIP_SETTLE, transform: `translateY(0) ${FLIP_LANDING_SQUASH}`, easing: EASE_OUT_BACK },
  { offset: 1, transform: 'translateY(0) scaleY(1)' },
];

// The half-height shifts spin the key around its center instead of its bottom-edge
// transform-origin. Animating transformOrigin instead would not work with composite
// 'add', which sums origins.
const SPIN_KEYFRAMES: Keyframe[] = [
  { transform: 'translateY(-50%) rotate(0turn) translateY(50%)' },
  { transform: 'translateY(-50%) rotate(1turn) translateY(50%)' },
];

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// composite 'add' stacks the flip on the entrance animation's transform instead of
// replacing it, so a flip mid-entrance doesn't snap the key out of its fall.
function flipClickedKey(event: MouseEvent) {
  if (!(event.target instanceof Element)) return;
  const key = event.target.closest(`.${styles.key}`);
  if (!key || matchMedia(REDUCED_MOTION_QUERY).matches) return;
  if (key.getAnimations().some(({ id }) => id === FLIP_ID)) return;
  key.animate(JUMP_KEYFRAMES, { id: FLIP_ID, duration: FLIP_DURATION_MS, composite: 'add' });
  key.animate(SPIN_KEYFRAMES, {
    id: FLIP_ID,
    delay: FLIP_TAKEOFF * FLIP_DURATION_MS,
    duration: (FLIP_LANDING - FLIP_TAKEOFF) * FLIP_DURATION_MS,
    easing: SPIN_EASING,
    composite: 'add',
  });
}

// Keys start paused and invisible; play them once the font is in so a fallback
// face never flashes mid-animation. Reveal on failure too, in the fallback face.
// jsdom (the smoke test) has no FontFaceSet, so reveal right away there.
function playWhenFontLoads(title: HTMLHeadingElement) {
  const reveal = () => {
    title.dataset.fontReady = '';
  };
  if (!('fonts' in document)) {
    reveal();
    return;
  }
  document.fonts.load(`1em ${getComputedStyle(title).fontFamily}`, NAME).then(reveal, reveal);
}

// One delegated listener covers every key. The heading owns it, so it goes away with
// the element and needs no cleanup.
function setUpTitle(title: HTMLHeadingElement | null) {
  if (!title) return;
  title.addEventListener('click', flipClickedKey);
  playWhenFontLoads(title);
}

export default function Title() {
  return (
    <h1 ref={setUpTitle} className={styles.title} aria-label={NAME}>
      {WORDS.map(({ start, keys }) => (
        <span key={start} className={styles.word} aria-hidden="true">
          {keys.map(({ letter, index }) => (
            <span key={index} className={styles.key} style={{ '--i': index }}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
