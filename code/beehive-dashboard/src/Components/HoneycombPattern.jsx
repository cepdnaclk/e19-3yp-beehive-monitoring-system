/*
Decorative honeycomb tessellation, drawn as an SVG <pattern> so it stays crisp
at any size and needs no image asset.

The tile is one full hexagon plus the single vertical edge that the row below
contributes. With a circumradius of 28 the tile measures 48.5 x 84, which is the
horizontal width and twice the 1.5R row pitch, so copies interlock into a real
honeycomb rather than a grid of separate hexagons with gaps between them.
*/
function HoneycombPattern({ id, className }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id={id}
          width="48.5"
          height="84"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24.25 0 L48.5 14 L48.5 42 L24.25 56 L0 42 L0 14 Z M24.25 56 L24.25 84"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default HoneycombPattern;
