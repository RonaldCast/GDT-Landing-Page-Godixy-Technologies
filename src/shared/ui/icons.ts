/** 24x24 stroke icons (Lucide-style geometry), rendered with stroke="currentColor". */
export const icons = {
  'custom-software': ['M8 7l-5 5 5 5', 'M16 7l5 5-5 5', 'M14 4l-4 16'],
  integration: ['M9 7V3', 'M15 7V3', 'M6 7h12v4a6 6 0 0 1-12 0V7z', 'M12 17v4'],
  support: [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    'M5.6 5.6l3.6 3.6',
    'M14.8 14.8l3.6 3.6',
    'M18.4 5.6l-3.6 3.6',
    'M9.2 14.8l-3.6 3.6',
  ],
  consulting: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M15.5 8.5l-2 5-5 2 2-5 5-2z'],
  automation: [
    'M4 5h6v6H4z',
    'M14 13h6v6h-6z',
    'M10 8h4a3 3 0 0 1 3 3v2',
    'M14 16h-4a3 3 0 0 1-3-3v-2',
  ],
  cloud: ['M7 18h10a4 4 0 0 0 .8-7.9A6 6 0 0 0 6.2 9.3 4.5 4.5 0 0 0 7 18z'],
  scope: ['M9 3h6l1 2h3v16H5V5h3l1-2z', 'M9 12l2 2 4-4'],
  verify: ['M12 3l8 4v5c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V7l8-4z', 'M9 12l2 2 4-4'],
  continuity: ['M21 12a9 9 0 1 1-3-6.7', 'M21 4v5h-5'],
  executive: ['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2'],
  engineer: ['M4 4h16v12H4z', 'M8 20h8', 'M12 16v4', 'M8 9l2 2-2 2', 'M13 13h3'],
  building: ['M4 21V5l8-3 8 3v16', 'M9 21v-5h6v5', 'M8 8h2', 'M14 8h2', 'M8 12h2', 'M14 12h2'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
} as const;

export type IconName = keyof typeof icons;
