import type { MouseEvent, PointerEvent } from 'react';
import { createCord, type Cord } from './cord';
import * as styles from './LightBulb.module.css';
import { springMotion, type Spring } from './spring';

type Theme = 'light' | 'dark';

// A bulb on a cord that switches the theme: lit is light mode. Pressing and holding
// pulls it down, letting go springs it back up past its rest point, and it settles
// with a little swing. Clicking or tapping is a quick version of the same tug.
const BOB_ID = 'bulb-bob';
const SWAY_ID = 'bulb-sway';
const PULL_DISTANCE_PX = 40;
// A click lets go before the slow hold pull gets anywhere, so a release from less
// than this first yanks the bulb down to it. Every release then bounces visibly.
const TUG_DISTANCE_PX = 24;
const HOLD_PULL_MS = 700;
const TUG_PULL_MS = 90;
const PULL_EASING = 'cubic-bezier(0.2, 0.7, 0.3, 1)';
// Swing at full pull, in either direction.
const SWAY_DEG = 4;
const DEG_PER_HALF_TURN = 180;

// Overshoots its rest point by about half the pull, then bobs a few more times.
const BOB_SPRING: Spring = { frequencyHz: 2, dampingRatio: 0.18 };
const SWAY_SPRING: Spring = { frequencyHz: 1.4, dampingRatio: 0.16 };
const SPRING_SAMPLES_PER_SECOND = 60;
const MS_PER_SECOND = 1000;
const COIN_FLIP = 0.5;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

// jsdom (the smoke test) has no matchMedia, but index.html sets data-theme there.
function currentTheme(): Theme {
  const { theme } = document.documentElement.dataset;
  if (theme === 'light' || theme === 'dark') return theme;
  return globalThis.matchMedia?.(DARK_SCHEME_QUERY).matches ? 'dark' : 'light';
}

function prefersReducedMotion() {
  return matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Samples a spring into keyframes that settle at 0.
function springKeyframes(
  spring: Spring,
  start: 'release' | 'kick',
  toKeyframe: (displacement: number) => Keyframe,
) {
  const { seconds, at } = springMotion(spring, start);
  const samples = Math.ceil(seconds * SPRING_SAMPLES_PER_SECOND);
  const keyframes = Array.from({ length: samples + 1 }, (_, index) =>
    toKeyframe(at((index / samples) * seconds)),
  );
  return { keyframes, durationMs: seconds * MS_PER_SECOND };
}

// Each bulb's cord, found from the bulb the handlers get as currentTarget.
const cords = new WeakMap<HTMLElement, Cord>();

// How far the bulb is pulled down right now. The hover dip is on `translate` and the
// swing on `rotate`, so `transform` holds only the bob.
function bobOffset(bulb: HTMLElement) {
  const { transform } = getComputedStyle(bulb);
  return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
}

// Where the cap is, relative to where the cord meets the ceiling. The bulb swings
// around that ceiling point (its transform-origin), so the cap moves on an arc.
function capOffset(bulb: HTMLElement) {
  const { translate, rotate } = getComputedStyle(bulb);
  const [dipX = 0, dipY = 0] = translate === 'none' ? [] : translate.split(' ').map(Number.parseFloat);
  const angle = rotate === 'none' ? 0 : (Number.parseFloat(rotate) * Math.PI) / DEG_PER_HALF_TURN;
  const reach = bulb.offsetTop + bobOffset(bulb);
  return { x: dipX - reach * Math.sin(angle), y: dipY + reach * Math.cos(angle) };
}

function isMoving(bulb: HTMLElement) {
  return bulb.getAnimations().some(({ playState }) => playState === 'running');
}

// Stops any pull or bounce in progress and returns where it left the bulb, so the
// next one starts from there instead of snapping.
function takeBobOffset(bulb: HTMLElement) {
  const offset = bobOffset(bulb);
  for (const animation of bulb.getAnimations()) {
    if (animation.id === BOB_ID) animation.cancel();
  }
  return offset;
}

function pull(bulb: HTMLElement, distancePx: number, durationMs: number) {
  const from = takeBobOffset(bulb);
  const animation = bulb.animate(
    [{ transform: `translateY(${from}px)` }, { transform: `translateY(${distancePx}px)` }],
    { id: BOB_ID, duration: durationMs, easing: PULL_EASING, fill: 'forwards' },
  );
  cords.get(bulb)?.wake();
  return animation;
}

function letGo(bulb: HTMLElement) {
  if (bobOffset(bulb) >= TUG_DISTANCE_PX) {
    recoil(bulb);
    return;
  }
  pull(bulb, TUG_DISTANCE_PX, TUG_PULL_MS).onfinish = () => recoil(bulb);
}

// The bounce and swing scale with how far the bulb was pulled, so a long hold
// bounces harder than a click; the cord ripples the same every time. Swings stack
// (composite 'add') so a second tug mid-swing doesn't snap the first one straight.
function recoil(bulb: HTMLElement) {
  const from = takeBobOffset(bulb);
  if (from === 0) return;
  const bob = springKeyframes(BOB_SPRING, 'release', (displacement) => ({
    transform: `translateY(${from * displacement}px)`,
  }));
  bulb.animate(bob.keyframes, { id: BOB_ID, duration: bob.durationMs });

  const direction = Math.random() < COIN_FLIP ? -1 : 1;
  const swayDeg = SWAY_DEG * (from / PULL_DISTANCE_PX) * direction;
  const sway = springKeyframes(SWAY_SPRING, 'kick', (displacement) => ({
    rotate: `${swayDeg * displacement}deg`,
  }));
  bulb.animate(sway.keyframes, { id: SWAY_ID, duration: sway.durationMs, composite: 'add' });
  cords.get(bulb)?.flick(direction);
}

// The colors fade between themes on their own (base.css transitions the theme tokens).
function switchTheme(bulb: HTMLElement) {
  const theme: Theme = currentTheme() === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  bulb.setAttribute('aria-pressed', String(theme === 'light'));
}

// Every press is captured, so its release comes back to the bulb even when the
// pointer has slid off or the bulb has been pulled out from under it.
function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
  if (event.button !== 0) return;
  const bulb = event.currentTarget;
  bulb.setPointerCapture(event.pointerId);
  if (prefersReducedMotion()) return;
  pull(bulb, PULL_DISTANCE_PX, HOLD_PULL_MS);
}

// Releasing switches the theme here rather than on click. A long hold pulls the
// bulb out from under a mouse pointer, so the press and release land on different
// elements and no click fires; phones drop the click after a long press too.
function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
  const bulb = event.currentTarget;
  if (!bulb.hasPointerCapture(event.pointerId)) return;
  switchTheme(bulb);
  if (!prefersReducedMotion()) letGo(bulb);
}

// A cancelled press didn't switch anything, so the bulb just drifts back without a tug.
function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
  if (prefersReducedMotion()) return;
  recoil(event.currentTarget);
}

// Pointer presses switch the theme on release, so only keyboard presses (detail 0)
// are handled here. They never pulled the bulb, so they get the click's tug.
function handleClick(event: MouseEvent<HTMLButtonElement>) {
  if (event.detail !== 0) return;
  const bulb = event.currentTarget;
  switchTheme(bulb);
  if (!prefersReducedMotion()) letGo(bulb);
}

// A long press on touch screens would open the context menu instead of holding.
function preventContextMenu(event: MouseEvent) {
  event.preventDefault();
}

// Hooks the cord to the bulb. The cord is redrawn whenever its box changes size
// (its length follows the viewport), which also draws it the first time. The
// hover dip is a CSS transition, so the cord wakes for those too. jsdom (the
// smoke test) has no ResizeObserver; the cord just isn't drawn there.
function setUpLamp(lamp: HTMLDivElement | null) {
  const bulb = lamp?.querySelector<HTMLButtonElement>(`.${styles.bulb}`);
  const line = lamp?.querySelector<SVGPathElement>(`.${styles['cord-line']}`);
  const box = line?.ownerSVGElement;
  if (!bulb || !line || !box || !('ResizeObserver' in globalThis)) return;
  const cord = createCord(line, () => capOffset(bulb), () => isMoving(bulb));
  cords.set(bulb, cord);
  new ResizeObserver((entries) => {
    for (const { contentRect } of entries) cord.redraw(contentRect.width);
  }).observe(box);
  bulb.addEventListener('transitionrun', cord.wake);
}

// Drawn in Figma (Group 4.svg). Colors live in the stylesheet so they follow the theme.
const GLASS_PATH =
  'M80 33C82.9998 33 84.9999 36.0444 86 38.0742C87 40.1041 89.5 57.3582 90.5 59.8955C91.1999 61.6714 93.8615 64.4397 95.3945 65.9424C109.735 76.715 119 93.7844 119 113C119 145.585 92.3609 172 59.5 172C26.6391 172 0 145.585 0 113C0 93.0083 10.0276 75.3394 25.3672 64.668C26.8069 63.1633 28.4687 61.2436 29 59.8955C30 57.3582 32.5 40.1041 33.5 38.0742C34.5001 36.0444 36.5002 33 39.5 33H80Z';
// Mask ids are page-wide, and there is only ever one bulb.
const GLASS_MASK_ID = 'light-bulb-glass';

export default function LightBulb() {
  return (
    <div ref={setUpLamp} className={styles.lamp}>
      <svg className={styles.cord} aria-hidden="true" focusable="false">
        <path className={styles['cord-line']} />
      </svg>
      <button
        type="button"
        className={styles.bulb}
        aria-label="Light"
        aria-pressed={currentTheme() === 'light'}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}        onClick={handleClick}
        onContextMenu={preventContextMenu}
      >
        <svg className={styles.drawing} viewBox="0 0 119 172" aria-hidden="true" focusable="false">
          {/* The glass outline is a 14-unit stroke masked to the glass's own shape,
              so only its inner half shows and the outline stays inside the bulb. */}
          <mask id={GLASS_MASK_ID} fill="white">
            <path d={GLASS_PATH} />
          </mask>
          <path className={styles.glass} d={GLASS_PATH} strokeWidth="14" mask={`url(#${GLASS_MASK_ID})`} />
          <path
            className={styles.filament}
            d="M55 93H64V33H71V94.1533C73.5086 94.6844 77.4915 96.4287 79.8262 99.2217C83.7551 103.922 84.0807 110.122 80.5537 113.07C77.0267 116.018 71.3693 115.911 67.4404 111.211C64.8877 108.157 64.0678 103.136 64.3174 100H54.6826C54.9322 103.136 54.1123 108.157 51.5596 111.211C47.6307 115.911 41.9733 116.018 38.4463 113.07C34.9193 110.122 35.2449 103.922 39.1738 99.2217C41.5085 96.4287 45.4914 94.6844 48 94.1533V33H55V93ZM48.3779 101.787C48.092 101.303 47.3636 101.26 46.7773 101.433C45.9399 101.679 44.5458 102.401 43.6787 103.438C42.2426 105.157 41.946 107.275 43.0156 108.169C44.0853 109.063 45.9489 108.852 47.3848 107.135C48.8207 105.417 48.944 102.745 48.3779 101.787ZM72.2227 101.433C71.6364 101.26 70.908 101.303 70.6221 101.787C70.056 102.745 70.1793 105.417 71.6152 107.135C73.0511 108.852 74.9147 109.063 75.9844 108.169C77.054 107.275 76.7574 105.157 75.3213 103.438C74.4542 102.401 73.0601 101.679 72.2227 101.433Z"
          />
          <path className={styles.cap} d="M43.5 25.5H75.5M47.5 14.5H71.5M50.5 3.5H67.5" strokeWidth="7" />
        </svg>
      </button>
    </div>
  );
}
