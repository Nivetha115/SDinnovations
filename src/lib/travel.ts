/**
 * Where the travelling aurora streak should be. GSAP (scroll) writes these; the WebGL scene reads them
 * every frame and eases toward them. x/y are fractions of the viewport (0 = centre), s is scale,
 * o is opacity, spin adds rotation.
 */
export const travel = { x: 0.08, y: 0.06, s: 1, o: 0, spin: 0 };

export type TravelState = Partial<typeof travel>;
