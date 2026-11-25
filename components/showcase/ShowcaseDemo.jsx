import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { NextIntlClientProvider } from 'next-intl';
import { getLabCopy } from '../../lib/lab';
import { ShowcaseRuntime } from './Runtime';
import { GraphicsGuard } from './Graphics';
import en from './messages/en.json';
import de from './messages/de.json';
import s from './showcase.module.css';

function Loading({ error, retry }) {
  const { locale } = useRouter();
  const copy = getLabCopy(locale);
  return <div className={s.loadState} role={error ? 'alert' : 'status'}><p>{error ? copy.error : copy.loading}</p>{error && <button type="button" onClick={retry}>{copy.retry}</button>}</div>;
}
const demos = {
  galaxy: dynamic(() => import('./demos/GalaxyDemo'), { ssr: false, loading: Loading }),
  aurora: dynamic(() => import('./demos/AuroraDemo'), { ssr: false, loading: Loading }),
  cubes: dynamic(() => import('./demos/CubesDemo'), { ssr: false, loading: Loading }),
  configurator: dynamic(() => import('./demos/ConfiguratorDemo'), { ssr: false, loading: Loading }),
  morph: dynamic(() => import('./demos/MorphDemo'), { ssr: false, loading: Loading }),
  planet: dynamic(() => import('./demos/PlanetDemo'), { ssr: false, loading: Loading }),
  micro: dynamic(() => import('./demos/MicroDemo'), { ssr: false, loading: Loading }),
  command: dynamic(() => import('./demos/PaletteDemo'), { ssr: false, loading: Loading }),
  theme: dynamic(() => import('./demos/ThemeDemo'), { ssr: false, loading: Loading }),
  flow: dynamic(() => import('./demos/FlowDemo'), { ssr: false, loading: Loading }),
  physics: dynamic(() => import('./demos/PhysicsDemo'), { ssr: false, loading: Loading }),
  dashboard: dynamic(() => import('./demos/DashboardDemo'), { ssr: false, loading: Loading }),
};
const spatial = new Set(['galaxy', 'aurora', 'cubes', 'configurator', 'morph', 'planet']);

export default function ShowcaseDemo({ id, locale, reducedMotion }) {
  const Demo = demos[id];
  return <NextIntlClientProvider locale={locale} messages={locale === 'en' ? en : de}>
    <ShowcaseRuntime reducedMotion={reducedMotion}>
      <div className={s.experiment} data-paused={reducedMotion ? 'true' : 'false'}>
        {spatial.has(id) ? <GraphicsGuard id={id} locale={locale}><Demo /></GraphicsGuard> : <Demo />}
      </div>
    </ShowcaseRuntime>
  </NextIntlClientProvider>;
}
