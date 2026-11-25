import { useId, useMemo, useRef, useState } from 'react';
import { FiActivity, FiCheck, FiChevronDown, FiCircle, FiGrid, FiMinus, FiMoreHorizontal, FiPlus, FiRefreshCw, FiSearch, FiShoppingBag, FiTrash2, FiZap } from 'react-icons/fi';
import styles from '../../../styles/lab-interfaces.module.css';

const COPY = {
  en: {
    sample: 'Concept interface · demo data',
    pulseTag: 'COMMERCE INTELLIGENCE', pulseTitle: 'Everything in perspective.', pulseDesc: 'Follow the numbers. Find the signal.', revenue: 'Settled revenue', orders: 'Orders', average: 'Average paid order', days: 'days',
    overview: 'Revenue overview', activity: 'Recent activity', sources: 'Traffic sources', direct: 'Direct', search: 'Search', social: 'Social', paid: 'Paid', pending: 'Pending', refunded: 'Refunded', all: 'All statuses', find: 'Find an order', order: 'Order', product: 'Product', amount: 'Amount', status: 'Status', noOrders: 'No matching orders.',
    chart: 'Daily settled revenue in euros', samplePeriod: 'Illustrative data · 2026',
    atelierTag: 'OBJECTS WITH INTENTION', atelierTitle: 'Everyday, elevated.', atelierDesc: 'A small collection. A considered experience.', collection: 'The collection', swipe: 'Swipe to explore · Tab to choose', add: 'Add to bag', bag: 'Your selection', empty: 'Your bag is waiting for something good.',
    subtotal: 'Subtotal', delivery: 'Delivery', discount: 'Studio discount', total: 'Total', standard: 'Standard', express: 'Express', free: 'Free', coupon: 'Discount code', apply: 'Apply', couponHint: 'Try STUDIO10 for 10% off.', invalidCoupon: 'That code is not available. Try STUDIO10 or clear it.', clearCoupon: 'Clear code', quoteReady: 'Selection updated', quoteDetail: 'A design concept. Explore finishes and build a bag; no orders or payments are created.', maxQuantity: 'Maximum 5 per finish', finish: 'Finish', lime: 'Citron', violet: 'Lilac', coral: 'Terracotta',
    relayTag: 'A LITTLE LESS CHAOS', relayTitle: 'Make room for good work.', relayDesc: 'A tactile workspace for the next great idea.', board: 'Studio board', addTask: 'Add task', taskTitle: 'What are we making?', priority: 'Priority', filterPriority: 'Filter by priority', allPriorities: 'All priorities', high: 'High', normal: 'Normal', low: 'Low', todo: 'To do', doing: 'In progress', done: 'Done', move: 'Move task', removeTask: 'Delete task', emptyColumn: 'Room for your next idea.', reset: 'Reset board', boardNote: 'Drag cards between columns, or use each card’s status menu. Changes are temporary.', tasks: 'tasks',
    remove: 'Remove one', increase: 'Add one', products: { arc: 'Arc lamp', form: 'Form speaker', loop: 'Loop clock' },
    initial: ['Explore visual direction', 'Craft the motion system', 'Build product cards', 'Polish mobile layouts', 'Define design tokens', 'Refine navigation'],
  },
  de: {
    sample: 'Konzeptoberfläche · Beispieldaten',
    pulseTag: 'COMMERCE INTELLIGENCE', pulseTitle: 'Alles im Blick.', pulseDesc: 'Zahlen verstehen. Zusammenhänge erkennen.', revenue: 'Bezahlter Umsatz', orders: 'Bestellungen', average: 'Ø bezahlte Bestellung', days: 'Tage',
    overview: 'Umsatzübersicht', activity: 'Letzte Aktivitäten', sources: 'Besucherquellen', direct: 'Direkt', search: 'Suche', social: 'Social', paid: 'Bezahlt', pending: 'Offen', refunded: 'Erstattet', all: 'Alle Status', find: 'Bestellung suchen', order: 'Bestellung', product: 'Produkt', amount: 'Betrag', status: 'Status', noOrders: 'Keine passenden Bestellungen.',
    chart: 'Täglicher bezahlter Umsatz in Euro', samplePeriod: 'Beispieldaten · 2026',
    atelierTag: 'OBJEKTE MIT CHARAKTER', atelierTitle: 'Für das Besondere im Alltag.', atelierDesc: 'Eine kleine Kollektion. Ein durchdachtes Erlebnis.', collection: 'Die Kollektion', swipe: 'Wischen zum Entdecken · Tab zum Wählen', add: 'Hinzufügen', bag: 'Deine Auswahl', empty: 'Deine Auswahl wartet auf etwas Besonderes.',
    subtotal: 'Zwischensumme', delivery: 'Versand', discount: 'Studio-Rabatt', total: 'Gesamt', standard: 'Standard', express: 'Express', free: 'Kostenlos', coupon: 'Rabattcode', apply: 'Anwenden', couponHint: 'STUDIO10 ausprobieren: 10 % Rabatt.', invalidCoupon: 'Dieser Code ist ungültig. Probiere STUDIO10 oder entferne ihn.', clearCoupon: 'Code entfernen', quoteReady: 'Auswahl aktualisiert', quoteDetail: 'Ein Designkonzept. Farben erkunden und Produkte auswählen; es entstehen keine Bestellungen oder Zahlungen.', maxQuantity: 'Maximal 5 pro Farbe', finish: 'Farbe', lime: 'Zitrone', violet: 'Flieder', coral: 'Terrakotta',
    relayTag: 'ETWAS WENIGER CHAOS', relayTitle: 'Platz für gute Arbeit.', relayDesc: 'Ein lebendiger Raum für die nächste große Idee.', board: 'Studio-Board', addTask: 'Aufgabe hinzufügen', taskTitle: 'Was gestalten wir?', priority: 'Priorität', filterPriority: 'Nach Priorität filtern', allPriorities: 'Alle Prioritäten', high: 'Hoch', normal: 'Normal', low: 'Niedrig', todo: 'Geplant', doing: 'In Arbeit', done: 'Fertig', move: 'Aufgabe verschieben', removeTask: 'Aufgabe löschen', emptyColumn: 'Platz für die nächste Idee.', reset: 'Zurücksetzen', boardNote: 'Karten ziehen oder das Statusmenü jeder Karte nutzen. Änderungen sind temporär.', tasks: 'Aufgaben',
    remove: 'Eines entfernen', increase: 'Eines hinzufügen', products: { arc: 'Arc Leuchte', form: 'Form Lautsprecher', loop: 'Loop Uhr' },
    initial: ['Visuelle Richtung erkunden', 'Bewegungssystem gestalten', 'Produktkarten entwickeln', 'Mobile Layouts verfeinern', 'Design-Tokens definieren', 'Navigation optimieren'],
  },
};

const PRODUCTS = [
  { id: 'arc', price: 12900, tone: 'lime', kind: 'lamp' },
  { id: 'form', price: 18900, tone: 'violet', kind: 'speaker' },
  { id: 'loop', price: 7900, tone: 'coral', kind: 'clock' },
];
const TONES = ['lime', 'violet', 'coral'];

function money(value, locale, digits = 0) {
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value / 100);
}

function DemoHeader({ brand, icon: Icon, tag, title, description, t, children }) {
  return <>
    <div className={styles.topbar}><span className={styles.brand}><span className={styles.brandIcon}><Icon aria-hidden /></span>{brand}<span className={styles.brandSlash}>/</span><span className={styles.topbarTag}>{tag}</span></span><span className={styles.sample}>{t.sample}</span></div>
    <div className={styles.heading}><div><h3>{title}</h3><p>{description}</p></div>{children}</div>
  </>;
}

function getSampleAnalytics(range) {
  const rows = Array.from({ length: 360 }, (_, index) => {
    const day = Math.floor(index / 4);
    const product = PRODUCTS[(index * 7 + day) % 3];
    const quantity = 1 + (index % 3 === 0 ? 1 : 0);
    return { id: `AT-${2080 + index}`, day, product: product.id, quantity, amount: product.price * quantity, status: index % 11 === 0 ? 'refunded' : index % 9 === 0 ? 'pending' : 'paid', source: ['direct', 'search', 'social', 'direct', 'search'][index % 5] };
  }).filter((row) => row.day >= 90 - range);
  const paid = rows.filter((row) => row.status === 'paid');
  const revenue = paid.reduce((sum, row) => sum + row.amount, 0);
  return {
    range, revenue, orders: rows.length, average: Math.round(revenue / paid.length),
    series: Array.from({ length: range }, (_, day) => ({ date: new Date(Date.UTC(2026, 10, 25 - range + day)).toISOString().slice(0, 10), revenue: paid.filter((row) => row.day === 90 - range + day).reduce((sum, row) => sum + row.amount, 0) })),
    sources: ['direct', 'search', 'social'].map((source) => ({ source, count: rows.filter((row) => row.source === source).length })),
    transactions: [...rows].reverse(),
  };
}

function RevenueChart({ data, locale, t }) {
  const gradient = `revenue-${useId().replace(/:/g, '')}`;
  const [selected, setSelected] = useState(null);
  const values = data.series;
  const width = 640, height = 178, left = 8, top = 16, bottom = 158;
  const max = Math.max(...values.map((value) => value.revenue), 1) * 1.15;
  const points = values.map((value, index) => [left + index * (width - 16) / (values.length - 1), bottom - value.revenue / max * (bottom - top)]);
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${point[0]},${point[1]}`).join(' ');
  const index = Math.min(selected ?? values.length - 1, values.length - 1);
  const date = (value) => new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
  return <figure className={styles.chart}>
    <figcaption><span>{t.overview}</span><span className={styles.chartReadout}>{date(values[index].date)} <strong>{money(values[index].revenue, locale)}</strong></span></figcaption>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t.chart} onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); setSelected(Math.max(0, Math.min(values.length - 1, Math.round((event.clientX - bounds.left) / bounds.width * (values.length - 1))))); }} onPointerLeave={() => setSelected(null)}>
      <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bfff3c" stopOpacity="0.24" /><stop offset="100%" stopColor="#bfff3c" stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75, 1].map((value) => <line key={value} x1="0" x2={width} y1={bottom - value * (bottom - top)} y2={bottom - value * (bottom - top)} stroke="rgba(255,255,255,.07)" strokeDasharray="3 5" />)}
      <path d={`${line} L${width - 8},${bottom} L${left},${bottom}Z`} fill={`url(#${gradient})`} />
      <path d={line} fill="none" stroke="#bfff3c" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <line x1={points[index][0]} x2={points[index][0]} y1={top} y2={bottom} stroke="#bfff3c" strokeOpacity="0.3" strokeDasharray="3 5" />
      <circle cx={points[index][0]} cy={points[index][1]} r="5" fill="#bfff3c" stroke="#101311" strokeWidth="3" />
    </svg>
    <div className={styles.chartDates}><span>{date(values[0].date)}</span><input type="range" min="0" max={values.length - 1} value={index} onChange={(event) => setSelected(Number(event.target.value))} aria-label={t.chart} aria-valuetext={`${date(values[index].date)}: ${money(values[index].revenue, locale)}`} /><span>{date(values[values.length - 1].date)}</span></div>
  </figure>;
}

function Pulse({ locale, t }) {
  const [range, setRange] = useState(30);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const data = useMemo(() => getSampleAnalytics(range), [range]);
  const transactions = data.transactions.filter((row) => (status === 'all' || status === row.status) && `${row.id} ${t.products[row.product]}`.toLowerCase().includes(search.toLowerCase()));
  return <div className={`${styles.demo} ${styles.pulse}`}>
    <DemoHeader brand="pulse" icon={FiActivity} tag={t.pulseTag} title={t.pulseTitle} description={t.pulseDesc} t={t}>
      <div className={styles.segmented} role="group" aria-label={t.days}>{[7, 30, 90].map((value) => <button type="button" key={value} aria-pressed={range === value} onClick={() => setRange(value)}>{value}<span> {t.days}</span></button>)}</div>
    </DemoHeader>
    <div className={styles.dashboard}>
      <div className={styles.metrics}>{[[t.revenue, money(data.revenue, locale), 'EUR'], [t.orders, data.orders, 'ORD'], [t.average, money(data.average, locale), 'AOV']].map(([label, value, unit]) => <div className={styles.metric} key={label}><div><span>{label}</span><span className={styles.metricUnit}>{unit}</span></div><strong key={`${label}-${range}`}>{value}</strong></div>)}</div>
      <div className={styles.chartGrid}>
        <RevenueChart data={data} locale={locale} t={t} />
        <div className={styles.sources}><h4>{t.sources}</h4>{data.sources.map(({ source, count }, index) => { const percentage = Math.round(count / data.orders * 100); return <div className={styles.source} key={source}><div><span>{t[source]}</span><strong>{percentage}%</strong></div><span className={styles.sourceTrack}><span style={{ width: `${percentage}%`, background: ['#bfff3c', '#a99aff', '#ffac87'][index] }} /></span></div>; })}<p>{t.samplePeriod}</p></div>
      </div>
      <div className={styles.activityHead}><h4>{t.activity}</h4><div className={styles.activityTools}><label className={styles.search}><FiSearch aria-hidden /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.find} aria-label={t.find} /></label><label className={styles.selectWrap}><select value={status} aria-label={t.status} onChange={(event) => setStatus(event.target.value)}>{['all', 'paid', 'pending', 'refunded'].map((value) => <option key={value} value={value}>{t[value]}</option>)}</select><FiChevronDown aria-hidden /></label></div></div>
      <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{t.order}</th><th>{t.product}</th><th>{t.amount}</th><th>{t.status}</th></tr></thead><tbody>{transactions.length ? transactions.slice(0, 5).map((row) => <tr key={row.id}><td className={styles.orderId}>{row.id}</td><td>{t.products[row.product]}<span className={styles.quantityTag}>×{row.quantity}</span></td><td>{money(row.amount, locale)}</td><td><span className={`${styles.status} ${styles[row.status]}`}>{t[row.status]}</span></td></tr>) : <tr><td colSpan="4" className={styles.emptyCell}>{t.noOrders}</td></tr>}</tbody></table></div>
    </div>
  </div>;
}

function ProductArt({ kind, tone, small = false }) {
  return <div aria-hidden className={`${styles.productArt} ${styles[tone]} ${small ? styles.smallArt : ''}`}>
    {kind === 'lamp' && <div className={styles.lamp}><i className={styles.lampShade} /><i className={styles.lampStem} /><i className={styles.lampBase} /><i className={styles.lampGlow} /></div>}
    {kind === 'speaker' && <div className={styles.speaker}><i className={styles.speakerTop} /><i className={styles.speakerBody} /><i className={styles.speakerDial} /></div>}
    {kind === 'clock' && <div className={styles.clock}><i className={styles.clockFace} /><i className={styles.clockHand} /><i className={styles.clockMinute} /><i className={styles.clockHub} /></div>}
  </div>;
}

function Atelier({ locale, t }) {
  const [tones, setTones] = useState({ arc: 'lime', form: 'violet', loop: 'coral' });
  const [items, setItems] = useState([{ id: 'arc', tone: 'lime', quantity: 1 }]);
  const [shipping, setShipping] = useState('standard');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState('');
  const validCoupon = coupon.trim().toUpperCase() === 'STUDIO10';
  const subtotal = items.reduce((sum, item) => sum + PRODUCTS.find(({ id }) => id === item.id).price * item.quantity, 0);
  const discount = validCoupon ? Math.round(subtotal / 10) : 0;
  const shippingCost = !items.length ? 0 : shipping === 'express' ? 1500 : subtotal - discount >= 20000 ? 0 : 590;
  const update = (id, tone, delta) => setItems((current) => {
    const existing = current.find((item) => item.id === id && item.tone === tone);
    if (!existing) return delta > 0 ? [...current, { id, tone, quantity: 1 }] : current;
    return current.map((item) => item.id === id && item.tone === tone ? { ...item, quantity: Math.min(5, item.quantity + delta) } : item).filter((item) => item.quantity > 0);
  });
  const clearCoupon = () => { setCoupon(''); setCouponInput(''); };
  return <div className={`${styles.demo} ${styles.atelier}`}>
    <DemoHeader brand="atelier" icon={FiShoppingBag} tag={t.atelierTag} title={t.atelierTitle} description={t.atelierDesc} t={t} />
    <div className={styles.storeGrid}>
      <div className={styles.collection}><div className={styles.collectionTitle}><h4>{t.collection}</h4><span>STUDIO / 2026</span></div><p className={styles.swipeHint}>{t.swipe}</p><div className={styles.products}>{PRODUCTS.map((product) => { const tone = tones[product.id]; const quantity = items.find((item) => item.id === product.id && item.tone === tone)?.quantity || 0; return <article className={styles.product} key={product.id}><ProductArt kind={product.kind} tone={tone} /><div className={styles.productDetails}><h5>{t.products[product.id]}</h5><span>{money(product.price, locale)}</span></div><div className={styles.swatches} role="group" aria-label={`${t.finish}: ${t.products[product.id]}`}>{TONES.map((value) => <button type="button" key={value} className={styles[value]} aria-label={t[value]} aria-pressed={tone === value} onClick={() => setTones((current) => ({ ...current, [product.id]: value }))} />)}<span>{t[tone]}</span></div><button type="button" className={styles.addButton} disabled={quantity >= 5} title={quantity >= 5 ? t.maxQuantity : undefined} onClick={() => update(product.id, tone, 1)}><FiPlus aria-hidden />{t.add}</button></article>; })}</div><div className={styles.collectionNote}><span className={styles.noteIcon}><FiCircle aria-hidden /></span><p>{t.quoteDetail}</p></div></div>
      <div className={styles.bag}>
        <div className={styles.bagTitle}><h4>{t.bag}</h4><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
        <div className={styles.bagItems}>{items.length ? items.map((item) => { const product = PRODUCTS.find(({ id }) => id === item.id); return <div className={styles.bagItem} key={`${item.id}-${item.tone}`}><ProductArt kind={product.kind} tone={item.tone} small /><div className={styles.bagItemInfo}><strong>{t.products[item.id]}</strong><span>{t[item.tone]} · {money(product.price * item.quantity, locale)}</span></div><div className={styles.quantity}><button type="button" aria-label={`${t.remove}: ${t.products[item.id]} ${t[item.tone]}`} onClick={() => update(item.id, item.tone, -1)}><FiMinus aria-hidden /></button><span>{item.quantity}</span><button type="button" disabled={item.quantity >= 5} aria-label={`${t.increase}: ${t.products[item.id]} ${t[item.tone]}`} onClick={() => update(item.id, item.tone, 1)}><FiPlus aria-hidden /></button></div></div>; }) : <p className={styles.emptyBag}><FiShoppingBag aria-hidden />{t.empty}</p>}</div>
        {items.length > 0 && <>
          <fieldset className={styles.shipping}><legend>{t.delivery}</legend>{['standard', 'express'].map((value) => <label key={value}><input type="radio" name="lab-shipping" value={value} checked={shipping === value} onChange={() => setShipping(value)} /><span>{t[value]}</span><span>{value === 'express' ? money(1500, locale) : '2–4 d'}</span></label>)}</fieldset>
          <form className={styles.couponForm} onSubmit={(event) => { event.preventDefault(); setCoupon(couponInput.trim()); }}><label htmlFor="lab-coupon">{t.coupon}</label><div><input id="lab-coupon" maxLength={20} value={couponInput} placeholder="STUDIO10" onChange={(event) => setCouponInput(event.target.value)} /><button type="submit">{t.apply}</button></div><p>{t.couponHint}</p>{coupon && <button type="button" className={styles.clearCoupon} onClick={clearCoupon}>{t.clearCoupon}</button>}</form>
          {coupon && !validCoupon && <p className={styles.error} role="alert">{t.invalidCoupon}</p>}
          <div className={styles.quote}><div><span>{t.subtotal}</span><strong>{money(subtotal, locale, 2)}</strong></div>{discount > 0 && <div className={styles.discount}><span>{t.discount}</span><strong>−{money(discount, locale, 2)}</strong></div>}<div><span>{t.delivery}</span><strong>{shippingCost ? money(shippingCost, locale, 2) : t.free}</strong></div><div className={styles.total}><span>{t.total}</span><strong>{money(subtotal - discount + shippingCost, locale, 2)}</strong></div></div>
          <div className={styles.quoteStatus} role="status"><FiCheck aria-hidden />{t.quoteReady}</div>
        </>}
      </div>
    </div>
  </div>;
}

const INITIAL_TASKS = [
  { id: 'task-1', copy: 0, status: 'todo', priority: 'high', tag: 'EXPLORATION' },
  { id: 'task-2', copy: 1, status: 'doing', priority: 'high', tag: 'MOTION' },
  { id: 'task-3', copy: 2, status: 'doing', priority: 'normal', tag: 'INTERFACE' },
  { id: 'task-4', copy: 3, status: 'todo', priority: 'normal', tag: 'CRAFT' },
  { id: 'task-5', copy: 4, status: 'done', priority: 'normal', tag: 'FOUNDATION' },
  { id: 'task-6', copy: 5, status: 'done', priority: 'low', tag: 'EXPERIENCE' },
];

function Relay({ t }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('normal');
  const [filter, setFilter] = useState('all');
  const [dragged, setDragged] = useState(null);
  const [over, setOver] = useState(null);
  const [notice, setNotice] = useState('');
  const nextId = useRef(7);
  const titleId = useId();
  const name = (task) => task.title || t.initial[task.copy];
  const move = (id, status) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    setTasks((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setDragged(null); setOver(null); setNotice(`${name(task)} · ${t[status]}`);
  };
  const add = (event) => {
    event.preventDefault();
    if (!title.trim() || tasks.length >= 30) return;
    const id = `task-${nextId.current++}`;
    setTasks((current) => [...current, { id, title: title.trim(), status: 'todo', priority, tag: 'STUDIO' }]);
    setNotice(`${title.trim()} · ${t.todo}`); setTitle(''); setFilter('all');
  };
  return <div className={`${styles.demo} ${styles.relay}`}>
    <DemoHeader brand="relay" icon={FiZap} tag={t.relayTag} title={t.relayTitle} description={t.relayDesc} t={t} />
    <div className={styles.boardToolbar}><div className={styles.boardTitle}><FiGrid aria-hidden /><h4>{t.board}</h4><span>{tasks.length} {t.tasks}</span></div><div className={styles.boardActions}><label className={styles.selectWrap}><select aria-label={t.filterPriority} value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">{t.allPriorities}</option>{['high', 'normal', 'low'].map((value) => <option key={value} value={value}>{t[value]}</option>)}</select><FiChevronDown aria-hidden /></label><button className={styles.resetButton} type="button" onClick={() => { setTasks(INITIAL_TASKS); setFilter('all'); setTitle(''); setPriority('normal'); setDragged(null); setOver(null); nextId.current = 7; setNotice(t.reset); }}><FiRefreshCw aria-hidden /><span>{t.reset}</span></button></div></div>
    <div className={styles.board}>{['todo', 'doing', 'done'].map((status) => { const columnTasks = tasks.filter((task) => task.status === status && (filter === 'all' || task.priority === filter)); return <section className={`${styles.column} ${styles[status]} ${over === status ? styles.dragOver : ''}`} key={status} aria-label={t[status]} onDragOver={(event) => { if (dragged) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setOver(status); } }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOver(null); }} onDrop={(event) => { event.preventDefault(); if (dragged && event.dataTransfer.getData('text/plain') === dragged) move(dragged, status); }}><div className={styles.columnHeading}><span className={styles.columnDot} /><h5>{t[status]}</h5><span className={styles.columnCount}>{columnTasks.length}</span><FiMoreHorizontal aria-hidden /></div><div className={styles.taskList}>{columnTasks.length ? columnTasks.map((task) => <article key={task.id} className={`${styles.task} ${dragged === task.id ? styles.dragging : ''}`} draggable onDragStart={(event) => { event.dataTransfer.setData('text/plain', task.id); event.dataTransfer.effectAllowed = 'move'; setDragged(task.id); }} onDragEnd={() => { setDragged(null); setOver(null); }}><div className={styles.taskTop}><span className={`${styles.priorityTag} ${styles[task.priority]}`}>{t[task.priority]}</span><button type="button" onClick={() => { setTasks((current) => current.filter((item) => item.id !== task.id)); setNotice(`${t.removeTask}: ${name(task)}`); }} aria-label={`${t.removeTask}: ${name(task)}`}><FiTrash2 aria-hidden /></button></div><h6>{name(task)}</h6><div className={styles.taskVisual} aria-hidden>{task.copy === 1 ? <span className={styles.motionWaves}><i /><i /><i /></span> : task.copy === 2 ? <span className={styles.cardSketch}><i /><i /><i /></span> : task.copy === 4 ? <span className={styles.tokenSketch}><i /><i /><i /><i /></span> : null}</div><div className={styles.taskBottom}><span>{task.tag}</span><span className={styles.taskAvatar}>AM</span></div><label className={`${styles.selectWrap} ${styles.taskMove}`}><select value={task.status} aria-label={`${t.move}: ${name(task)}`} onChange={(event) => move(task.id, event.target.value)}>{['todo', 'doing', 'done'].map((value) => <option key={value} value={value}>{t[value]}</option>)}</select><FiChevronDown aria-hidden /></label></article>) : <p className={styles.emptyColumn}><FiPlus aria-hidden />{t.emptyColumn}</p>}</div></section>; })}</div>
    <form className={styles.newTask} onSubmit={add}><label htmlFor={titleId} className={styles.srOnly}>{t.taskTitle}</label><FiPlus aria-hidden /><input id={titleId} value={title} maxLength={60} onChange={(event) => setTitle(event.target.value)} placeholder={t.taskTitle} /><label className={styles.selectWrap}><select aria-label={t.priority} value={priority} onChange={(event) => setPriority(event.target.value)}>{['high', 'normal', 'low'].map((value) => <option key={value} value={value}>{t[value]}</option>)}</select><FiChevronDown aria-hidden /></label><button type="submit" disabled={!title.trim() || tasks.length >= 30}>{t.addTask}</button></form>
    <p className={styles.boardNote}>{t.boardNote}</p><p role="status" aria-live="polite" className={styles.srOnly}>{notice}</p>
  </div>;
}

export default function InterfaceDemo({ id, locale = 'de', reducedMotion = false }) {
  const language = locale === 'en' ? 'en' : 'de';
  const props = { locale: language, t: COPY[language] };
  const content = id === 'pulse' ? <Pulse {...props} /> : id === 'atelier' ? <Atelier {...props} /> : <Relay {...props} />;
  return <div className={reducedMotion ? styles.reducedMotion : undefined}>{content}</div>;
}
