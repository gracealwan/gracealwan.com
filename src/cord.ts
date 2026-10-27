import { FULL_TURN_RAD, springMotion, type Spring } from './spring';

// The cord between the ceiling and the bulb's cap. It runs straight from the
// ceiling to wherever the cap is, so it follows every dip, bounce and swing. When
// flicked it ripples like a pull cord snapping back: an S-curve along its whole
// length that flips from side to side, smaller each time, until it hangs straight.
// Coordinates are CSS pixels from the ceiling point; the SVG it draws in has the
// ceiling as its top edge and is centered on that point.

type Vector = { x: number; y: number };

export type Cord = {
  redraw: (width: number) => void;
  wake: () => void;
  flick: (direction: 1 | -1) => void;
};

// Out to one side in about 0.1s, then over to the other, dying away in about a
// second. Timing follows the pull-chain pen this is modelled on.
const RIPPLE_SPRING: Spring = { frequencyHz: 2.5, dampingRatio: 0.14 };
// The S-curve's widest bend, as a share of the cord's length.
const RIPPLE_AMPLITUDE = 0.22;
// Points along the cord, enough for the S to draw as one smooth curve.
const SAMPLES = 24;
const HALF = 0.5;
const MS_PER_SECOND = 1000;
const PATH_DECIMALS = 2;

export function createCord(
  path: SVGPathElement,
  readEnd: () => Vector,
  isEndMoving: () => boolean,
): Cord {
  const ripple = springMotion(RIPPLE_SPRING, 'kick');
  let originX = 0;
  let frame = 0;
  let rippleStart = -Infinity;
  let rippleSize = 0;

  function rippleSeconds(now: number) {
    return (now - rippleStart) / MS_PER_SECOND;
  }

  // One full sine wave along the cord, sideways to it, so both ends stay put and
  // the middle makes an S. A curve through the midpoints between samples keeps it
  // smooth.
  function draw(now: number) {
    const end = readEnd();
    const length = Math.hypot(end.x, end.y) || Number.EPSILON;
    const bend = rippleSize * length * ripple.at(rippleSeconds(now));
    const points = Array.from({ length: SAMPLES + 1 }, (_, index) => {
      const along = index / SAMPLES;
      const offset = bend * Math.sin(FULL_TURN_RAD * along);
      return {
        x: end.x * along - (end.y / length) * offset,
        y: end.y * along + (end.x / length) * offset,
      };
    });
    const at = ({ x, y }: Vector) =>
      `${(originX + x).toFixed(PATH_DECIMALS)} ${y.toFixed(PATH_DECIMALS)}`;
    const commands = points.map((point, index) => {
      const next = points[index + 1];
      if (index === 0) return `M ${at(point)}`;
      if (!next) return `L ${at(point)}`;
      return `Q ${at(point)} ${at({ x: (point.x + next.x) * HALF, y: (point.y + next.y) * HALF })}`;
    });
    path.setAttribute('d', commands.join(' '));
  }

  function tick(now: number) {
    draw(now);
    if (rippleSeconds(now) >= ripple.seconds && !isEndMoving()) {
      frame = 0;
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  function wake() {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function redraw(width: number) {
    originX = width * HALF;
    draw(performance.now());
  }

  function flick(direction: 1 | -1) {
    rippleStart = performance.now();
    rippleSize = RIPPLE_AMPLITUDE * direction;
    wake();
  }

  return { redraw, wake, flick };
}
