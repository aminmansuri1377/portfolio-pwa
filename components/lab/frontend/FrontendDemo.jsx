import EditorialGallery from './EditorialGallery';
import SpringStudio from './SpringStudio';
import TypeStudio from './TypeStudio';

export default function FrontendDemo({id, locale = 'en', reducedMotion = false}) {
  if (id === 'kinetic') return <SpringStudio locale={locale} reducedMotion={reducedMotion} />;
  if (id === 'palette') return <TypeStudio locale={locale} reducedMotion={reducedMotion} />;
  return <EditorialGallery locale={locale} reducedMotion={reducedMotion} />;
}
