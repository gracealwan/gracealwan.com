// Underdamped springs, shared by the bulb's bounce and swing and the cord's ripple.
export type Spring = { frequencyHz: number; dampingRatio: number };

export const FULL_TURN_RAD = 6.283185307179586;
// A spring counts as settled once its motion is below 1% of where it started.
const SETTLED = 0.01;

// Displacement over time in seconds, settling at 0. A release starts held at 1 and
// is let go; a kick starts at rest and is knocked to one side, peaking a little
// under 1.
export function springMotion({ frequencyHz, dampingRatio }: Spring, start: 'release' | 'kick') {
  const angular = FULL_TURN_RAD * frequencyHz;
  const decay = dampingRatio * angular;
  const damped = angular * Math.sqrt(1 - dampingRatio * dampingRatio);
  const seconds = -Math.log(SETTLED) / decay;
  const at = (time: number) => {
    if (time >= seconds) return 0;
    const swing =
      start === 'release'
        ? Math.cos(damped * time) + (decay / damped) * Math.sin(damped * time)
        : Math.sin(damped * time);
    return Math.exp(-decay * time) * swing;
  };
  return { seconds, at };
}
