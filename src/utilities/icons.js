/* ==========================================================
   ICONS — shared inline-SVG icon set. Each function returns a
   markup string sized by `size` (px) that inherits currentColor.
   ========================================================== */
const svg = (paths, size=16, viewBox='0 0 24 24') =>
  `<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const iconPlus     = (s=16) => svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>', s);
export const iconEdit     = (s=16) => svg('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/>', s);
export const iconTrash    = (s=16) => svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>', s);
export const iconClose    = (s=16) => svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', s);
export const iconChevronL = (s=16) => svg('<polyline points="15 18 9 12 15 6"/>', s);
export const iconWhatsapp = (s=16) => svg('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>', s);
export const iconMail     = (s=16) => svg('<path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/>', s);
export const iconGlobe    = (s=16) => svg('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', s);
