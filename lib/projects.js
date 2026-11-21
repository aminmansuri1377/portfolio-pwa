// Project data. Copy (title, tagline, overview, ...) lives in messages/*.json
// under Projects.cases.<slug>. To add a project: add an entry here, drop the
// images into public/assets/projects/ and add the copy in both languages.
export const PROJECTS = [
  {
    slug: 'shoplon',
    type: 'client',
    image: '/assets/projects/shoplonland.jpg',
    hero: '/assets/projects/shoplon.jpg',
    gallery: ['/assets/projects/shoplon.jpg', '/assets/projects/shoplonland.jpg'],
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recoil', 'REST', 'Axios'],
    live: 'https://shoplon.ir',
  },
  {
    slug: 'magreach',
    type: 'client',
    image: '/assets/projects/mag.jpg',
    hero: '/assets/projects/magr.jpg',
    gallery: ['/assets/projects/magr.jpg', '/assets/projects/mag.jpg'],
    tags: ['Next.js', 'Material UI', 'Tailwind CSS', 'Recoil', 'next-auth', 'React Hook Form'],
    live: 'https://dashboard.magreach.ir',
  },
  {
    slug: 'gameplanet',
    type: 'own',
    image: '/assets/projects/planet.jpg',
    hero: '/assets/projects/gplanet.jpg',
    gallery: ['/assets/projects/gplanet.jpg', '/assets/projects/planet.jpg'],
    tags: ['Next.js', 'TypeScript', 'Prisma', 'tRPC', 'Three.js', 'next-auth', 'Supabase', 'i18next'],
    live: 'https://game-planet-one.vercel.app',
  },
  {
    slug: 'zinamatv',
    type: 'client',
    image: '/assets/projects/zeenamatv.png',
    hero: '/assets/projects/zeenamatv.png',
    gallery: ['/assets/projects/zeenamatv.png'],
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recoil', 'Material UI', 'next-auth', 'Custom Player'],
    live: 'https://zinamatv.com',
  },
  {
    slug: 'rentta',
    type: 'own',
    image: '/assets/projects/rentta.png',
    hero: '/assets/projects/rentta.png',
    gallery: ['/assets/projects/rentta.png', '/assets/projects/property.jpg'],
    tags: ['Next.js', 'TypeScript', 'Prisma', 'tRPC', 'Leaflet', 'next-auth', 'Supabase', 'i18next'],
    live: 'https://rentta.ir',
  },
  {
    slug: 'twitch',
    type: 'study',
    image: '/assets/projects/twitch.jpg',
    hero: '/assets/projects/twitch.jpg',
    gallery: ['/assets/projects/twitch.jpg'],
    tags: ['Next.js', 'Tailwind CSS', 'next-auth', 'OAuth'],
    live: null,
  },
];

export function getProject(slug) {
  return PROJECTS.find((p) => p.slug === slug);
}
