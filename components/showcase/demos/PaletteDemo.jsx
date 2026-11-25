import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCommand, FiCopy, FiMoon, FiSearch, FiSun, FiBell, FiGithub, FiHome, FiFolder, FiSettings, FiX } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { SITE } from '../../../lib/site';

function fuzzy(query, text) {
  if (!query) return { score: 0, idx: [] };
  const lt = text.toLowerCase();
  const lq = query.toLowerCase();
  const idx = [];
  let qi = 0;
  let score = 0;
  let last = -2;
  for (let i = 0; i < lt.length && qi < lq.length; i++) {
    if (lt[i] === lq[qi]) {
      idx.push(i);
      score += (i === last + 1 ? 5 : 1) + (i === 0 ? 3 : 0);
      last = i;
      qi++;
    }
  }
  return qi === lq.length ? { score, idx } : null;
}

function Highlight({ text, idx }) {
  const set = new Set(idx);
  return (
    <span>
      {text.split('').map((ch, i) => (
        <span key={i} className={set.has(i) ? 'text-lime' : ''}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function PaletteDemo() {
  const t = useTranslations('Showcase.ui');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [page, setPage] = useState('dashboard');
  const [light, setLight] = useState(false);
  const [notify, setNotify] = useState(true);
  const [toast, setToast] = useState('');
  const input = useRef(null);
  const panel = useRef(null);
  const trigger = useRef(null);
  const listId = useId();
  const [emailFallback, setEmailFallback] = useState(false);
  const toastTimer = useRef(0);

  const say = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  }, []);

  const commands = useMemo(
    () => [
      { id: 'p1', group: t('grpNavigate'), label: t('cmdDashboard'), icon: FiHome, run: () => setPage('dashboard') },
      { id: 'p2', group: t('grpNavigate'), label: t('cmdProjects'), icon: FiFolder, run: () => setPage('projects') },
      { id: 'p3', group: t('grpNavigate'), label: t('cmdSettings'), icon: FiSettings, run: () => setPage('settings') },
      { id: 't1', group: t('grpTheme'), label: light ? t('cmdDark') : t('cmdLight'), icon: light ? FiMoon : FiSun, run: () => setLight((v) => !v) },
      { id: 'a1', group: t('grpActions'), label: notify ? t('cmdMute') : t('cmdUnmute'), icon: FiBell, run: () => { setNotify((v) => !v); say(notify ? t('toastMuted') : t('toastUnmuted')); } },
      {
        id: 'a2',
        group: t('grpActions'),
        label: t('cmdCopyEmail'),
        icon: FiCopy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(SITE.email);
            say(t('toastCopied'));
          } catch (e) {
            setEmailFallback(true);
          }
        },
      },
      { id: 'a3', group: t('grpActions'), label: t('cmdGithub'), icon: FiGithub, run: () => window.open(SITE.github, '_blank', 'noopener') },
    ],
    [t, light, notify, say]
  );

  const results = useMemo(() => {
    return commands
      .map((c) => ({ c, m: fuzzy(query, c.label) }))
      .filter((r) => r.m)
      .sort((a, b) => b.m.score - a.m.score)
      .map((r) => ({ ...r.c, idx: r.m.idx }));
  }, [commands, query]);

  useEffect(() => setCursor(0), [query, open]);
  useEffect(() => {
    if (open) {
      const previous = document.activeElement;
      const timer = requestAnimationFrame(() => input.current?.focus());
      return () => { cancelAnimationFrame(timer); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
    }
    setQuery('');
  }, [open]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setOpen(false);
      } else if (e.key === 'Tab' && open) {
        const focusable = panel.current?.querySelectorAll('input, button:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${results[cursor]?.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [cursor, open, results, listId]);

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.max(0, Math.min(results.length - 1, c + 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = results[cursor];
      if (cmd) {
        cmd.run();
        setOpen(false);
      }
    }
  };

  const surface = light ? 'bg-[#f4f4f0] text-ink-900' : 'bg-ink-900 text-white';
  const card = light ? 'border-black/10 bg-white' : 'border-white/10 bg-white/[0.03]';

  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden p-3 md:p-8">
      <div className={`relative flex h-full max-h-[560px] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-colors duration-500 ${surface}`}>
        <aside className={`hidden w-48 shrink-0 flex-col gap-1 border-r p-4 sm:flex ${light ? 'border-black/10' : 'border-white/10'}`}>
          <p className="mb-3 font-display text-sm font-bold">Acme<span className="text-lime">.app</span></p>
          {['dashboard', 'projects', 'settings'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${page === p ? 'bg-lime/20 font-semibold' : 'opacity-60 hover:opacity-100'}`}
            >
              {t(`page_${p}`)}
            </button>
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={`flex items-center justify-between border-b px-4 py-3 ${light ? 'border-black/10' : 'border-white/10'}`}>
            <p className="font-display text-lg font-bold">{t(`page_${page}`)}</p>
            <button
              type="button"
              ref={trigger}
              aria-label={t('searchPlaceholder')}
              onClick={() => setOpen(true)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${light ? 'border-black/15' : 'border-white/15'} opacity-80 hover:opacity-100`}
            >
              <FiSearch size={13} />
              <span className="hidden sm:inline">{t('searchPlaceholder')}</span>
              <kbd className="flex items-center gap-0.5 rounded bg-black/20 px-1.5 py-0.5 font-mono text-xs">
                <FiCommand size={10} />K
              </kbd>
            </button>
          </div>
          <div className="grid flex-1 content-start gap-3 p-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`rounded-xl border p-4 ${card}`}>
                <p className="font-mono text-xs uppercase tracking-widest opacity-50">{t(`page_${page}`)} · 0{i}</p>
                <div className="mt-3 h-2 w-2/3 rounded bg-current opacity-10" />
                <div className="mt-2 h-2 w-1/2 rounded bg-current opacity-10" />
              </div>
            ))}
            <p className="col-span-full text-center text-xs opacity-60">
              {notify ? t('notifyOn') : t('notifyOff')}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-start justify-center bg-black/60 p-4 pt-[12%] backdrop-blur-sm"
              onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
            >
              <motion.div
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-label={t('searchPlaceholder')}
                initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-ink-900 text-white shadow-2xl"
              >
                <div className="flex items-center gap-3 border-b border-white/10 px-4">
                  <FiSearch className="text-muted" />
                  <input
                    ref={input}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded="true"
                    aria-controls={listId}
                    aria-activedescendant={results[cursor] ? `${listId}-${results[cursor].id}` : undefined}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKey}
                    placeholder={t('searchPlaceholder')}
                    aria-label={t('searchPlaceholder')}
                    className="h-12 min-w-0 w-full bg-transparent text-base outline-none placeholder:text-muted"
                  />
                  <button type="button" onClick={() => setOpen(false)} aria-label={t('close')} className="grid h-10 w-10 shrink-0 place-items-center text-muted"><FiX /></button>
                </div>
                <ul id={listId} aria-label={t('searchPlaceholder')} className="max-h-72 overflow-y-auto p-2" role="listbox" data-lenis-prevent>
                  {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">{t('noResults')}</li>}
                  {results.map((c, i) => {
                    const Icon = c.icon;
                    const showGroup = i === 0 || results[i - 1].group !== c.group;
                    return (
                      <li key={c.id} role="presentation">
                        {showGroup && (
                          <p className="px-3 pb-1 pt-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">{c.group}</p>
                        )}
                        <button
                          type="button"
                          role="option"
                          id={`${listId}-${c.id}`}
                          tabIndex={-1}
                          aria-selected={cursor === i}
                          onMouseEnter={() => setCursor(i)}
                          onClick={() => {
                            c.run();
                            setOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${cursor === i ? 'bg-white/10' : ''}`}
                        >
                          <Icon size={15} className={cursor === i ? 'text-lime' : 'text-muted'} />
                          <Highlight text={c.label} idx={c.idx} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono text-xs text-muted">
                  <span>↑↓ {t('navigate')}</span>
                  <span>↵ {t('select')}</span>
                  <span>esc {t('close')}</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {emailFallback && <label className="absolute bottom-4 inset-x-4 z-20 rounded-xl border border-lime/30 bg-ink-900 p-3 text-sm text-white">{t('copyManually')}<input aria-label={t('cmdCopyEmail')} readOnly value={SITE.email} onFocus={event => event.target.select()} className="mt-2 w-full rounded border border-white/20 bg-transparent p-2 text-base" /></label>}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              role="status"
              className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-lime px-4 py-2 font-mono text-xs font-semibold text-ink-950"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
