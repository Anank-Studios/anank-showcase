/**
 * Grão de filme — SVG feTurbulence estático (animar custa GPU e não
 * acrescenta). opacity .035, mix-blend-mode overlay, fora do fluxo de clique.
 */
export function FilmGrain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-60 h-full w-full opacity-[0.035] mix-blend-overlay"
    >
      <filter id="oniria-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={4} stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#oniria-grain)" />
    </svg>
  );
}
