import { LAB_ADDITIONS, ADDITIONS_EN, ADDITIONS_DE } from './lab-additions';

// Visual Lab is deliberately frontend-only. All examples run in the visitor's browser.
export const LAB_VIEWS = [
  { id: 'aura', name: 'AURA', category: 'spatial', accent: '#c7ef98', tags: ['Three.js', 'Product design'], featured: true },
  { id: 'folio', name: 'FOLIO', category: 'creative', accent: '#f6aa85', tags: ['Art direction', 'Motion'] },
  { id: 'pulse', name: 'PULSE', category: 'interfaces', accent: '#bfff3c', tags: ['Data visualization', 'React'] },
  { id: 'flux', name: 'FLUX', category: 'spatial', accent: '#c8b3ff', tags: ['GLSL', 'Generative art'] },
  { id: 'kinetic', name: 'KINETIC', category: 'creative', accent: '#a5c9ff', tags: ['Spring physics', 'Interaction'] },
  { id: 'atelier', name: 'ATELIER', category: 'interfaces', accent: '#e8b99a', tags: ['Commerce UI', 'State design'] },
  { id: 'orbit', name: 'ORBIT', category: 'spatial', accent: '#a4a1ff', tags: ['Particles', 'Three.js'] },
  { id: 'palette', name: 'PALETTE', category: 'creative', accent: '#e7f08c', tags: ['Typography', 'Design tools'] },
  { id: 'relay', name: 'RELAY', category: 'interfaces', accent: '#8cd3bc', tags: ['Drag & drop', 'Product UI'] },
  ...LAB_ADDITIONS,
];

// Related techniques share one studio. Direct links to every original view still work.
const STUDIO_VIEWS = {
  aura: ['aura', 'configurator'],
  pulse: ['pulse', 'dashboard'],
  flux: ['flux', 'aurora'],
  kinetic: ['kinetic', 'micro', 'physics'],
  orbit: ['orbit', 'galaxy', 'morph'],
  palette: ['palette', 'theme'],
};
const secondaryViews = new Set(Object.values(STUDIO_VIEWS).flatMap(views => views.slice(1)));
export const LAB_EXPERIMENTS = LAB_VIEWS.filter(view => !secondaryViews.has(view.id)).map(view => ({
  ...view, views: STUDIO_VIEWS[view.id] || [view.id], featured: view.featured || view.id === 'flow',
}));
export function getLabExperiment(viewId) {
  return LAB_EXPERIMENTS.find(experiment => experiment.views.includes(viewId));
}

const en = {
  meta: 'Visual Lab — interactive frontend experiments, creative interfaces and real-time 3D by Amin Mansori.',
  eyebrow: 'CREATIVE DEVELOPMENT / INTERACTIVE COLLECTION',
  title: ['Code.', 'Made tangible.'],
  intro: 'Interfaces with character. Motion you can feel. Worlds you can turn in your hands. A collection built to be explored.',
  explore: 'Explore the collection', enter: 'Enter the 3D studio',
  categories: { all: 'All experiments', spatial: 'Three.js / 3D', creative: 'Creative frontend', interfaces: 'Product interfaces' },
  strap: 'Design meets interaction.', count: `${LAB_EXPERIMENTS.length} interactive studios`,
  collection: 'THE COLLECTION', collectionTitle: 'Curiosity, in full colour.',
  collectionText: 'Choose a world. Change the details. Make it yours.',
  open: 'Open experiment', close: 'Close experiment', next: 'Next experiment', previous: 'Previous experiment',
  loading: 'Preparing the experience…', error: 'This experiment could not be loaded.', retry: 'Try again',
  motionOn: 'Pause motion', motionOff: 'Resume motion', motionReduced: 'Reduced motion enabled',
  closeHint: 'Esc to close', detail: 'WHAT TO EXPLORE', built: 'Built with',
  footerTitle: 'Have something extraordinary in mind?',
  footerText: 'Let’s turn the idea into an interface people remember.', footerCta: 'Let’s talk',
  frontendNote: 'Independent frontend studies. Everything runs in your browser; any products, figures and tasks are illustrative.',
  teaserKicker: 'NEW / VISUAL LAB', teaserTitle: '13 creative studios.', teaserAccent: 'All live.',
  teaserText: 'Interactive worlds, expressive interfaces and creative motion. Explore 13 distinct studios with 21 interactive modes, right in your browser.',
  teaserCta: 'Enter the Visual Lab', teaserCaption: 'FRONTEND · MOTION · THREE.JS',
  viewLabels: { aura: 'Headphones', configurator: 'Materials & shapes', pulse: 'Analytics', dashboard: 'Live monitor', flux: '3D sculpture', aurora: 'Fluid shader', kinetic: 'Spring studio', micro: 'Micro-interactions', physics: 'Gravity playground', orbit: 'Galaxy studio', galaxy: 'Shader galaxy', morph: 'Particle morph', palette: 'Typography', theme: 'Theme tokens' },
  groupDescriptions: {
    aura: ['The product studio.', 'Sculpted headphones and expressive objects, together in one studio for form, materials and light.'],
    pulse: ['Data, in motion.', 'Explore a detailed analytics interface or a live monitor driven by locally simulated data.'],
    flux: ['One shader lab. Two worlds.', 'Move between a living 3D sculpture and an immersive fluid field.'],
    kinetic: ['The interaction playground.', 'Tune a spring, explore expressive UI details and play with a gravity simulation.'],
    orbit: ['A universe of particles.', 'Compose a galaxy, trigger a starburst or morph thousands of particles between forms.'],
    palette: ['The design studio.', 'Shape a typographic poster and build a complete visual theme with live CSS tokens.'],
  },
  descriptions: {
    ...ADDITIONS_EN,
    aura: ['Sound, sculpted.', 'A tactile product studio. Rotate the headphones, change the finish and pull the design apart.', 'Orbit the product, try a different finish, then explore the exploded view.'],
    folio: ['A new perspective.', 'An editorial world of colour, composition and beautifully choreographed transitions.', 'Move between three art-directed scenes. Each one reshapes the layout, colour and mood.'],
    pulse: ['Clarity in the data.', 'A precise analytics interface that makes complex information feel effortless.', 'Switch the date range, inspect the chart and filter the illustrative activity.'],
    flux: ['A living sculpture.', 'An evolving study in light, surface and generative geometry.', 'Reshape the surface, change its colour and reveal the geometry underneath.'],
    kinetic: ['A little push. A lot of play.', 'An interaction studio where small gestures create expressive movement.', 'Drag the object or use the direction buttons. Tune the spring and see how it responds.'],
    atelier: ['Objects of desire.', 'An intimate shopping experience with expressive products and a carefully composed bag.', 'Explore the objects, choose a finish and build a sample bag. No orders are placed.'],
    orbit: ['Your own small universe.', 'Thousands of particles, drawn together into a quietly mesmerising galaxy.', 'Orbit the field, change its formation and find your favourite palette.'],
    palette: ['Type with a point of view.', 'A live art-direction tool. Turn a few words into a striking typographic composition.', 'Edit the words, tune the typography and compare layouts and colour treatments.'],
    relay: ['Work, beautifully in flow.', 'A focused workspace with tactile cards and purposeful interaction.', 'Add a sample task, move it between columns and filter by priority. Changes stay in this session.'],
  },
};

const de = {
  meta: 'Visual Lab — interaktive Frontend-Experimente, kreative Interfaces und Echtzeit-3D von Amin Mansori.',
  eyebrow: 'CREATIVE DEVELOPMENT / INTERAKTIVE KOLLEKTION',
  title: ['Code.', 'Zum Erleben.'],
  intro: 'Interfaces mit Charakter. Bewegung, die sich gut anfühlt. Welten zum Entdecken. Eine Kollektion, die zum Ausprobieren einlädt.',
  explore: 'Kollektion entdecken', enter: '3D-Studio öffnen',
  categories: { all: 'Alle Experimente', spatial: 'Three.js / 3D', creative: 'Kreatives Frontend', interfaces: 'Produkt-Interfaces' },
  strap: 'Design trifft Interaktion.', count: `${LAB_EXPERIMENTS.length} interaktive Studios`,
  collection: 'DIE KOLLEKTION', collectionTitle: 'Neugier in voller Farbe.',
  collectionText: 'Eine Welt wählen. Details verändern. Neues entdecken.',
  open: 'Experiment öffnen', close: 'Experiment schließen', next: 'Nächstes Experiment', previous: 'Vorheriges Experiment',
  loading: 'Das Erlebnis wird vorbereitet…', error: 'Dieses Experiment konnte nicht geladen werden.', retry: 'Erneut versuchen',
  motionOn: 'Bewegung pausieren', motionOff: 'Bewegung fortsetzen', motionReduced: 'Reduzierte Bewegung aktiv',
  closeHint: 'Esc zum Schließen', detail: 'ZUM AUSPROBIEREN', built: 'Entwickelt mit',
  footerTitle: 'Eine außergewöhnliche Idee im Kopf?',
  footerText: 'Lassen Sie uns daraus ein Interface machen, das in Erinnerung bleibt.', footerCta: 'Kontakt aufnehmen',
  frontendNote: 'Eigenständige Frontend-Studien. Alles läuft im Browser; Produkte, Kennzahlen und Aufgaben dienen zur Demonstration.',
  teaserKicker: 'NEU / VISUAL LAB', teaserTitle: '13 kreative Studios.', teaserAccent: 'Alle live.',
  teaserText: 'Interaktive Welten, ausdrucksstarke Interfaces und kreative Bewegung. 13 eigenständige Studios mit 21 interaktiven Modi, direkt im Browser.',
  teaserCta: 'Visual Lab betreten', teaserCaption: 'FRONTEND · MOTION · THREE.JS',
  viewLabels: { aura: 'Kopfhörer', configurator: 'Material & Form', pulse: 'Analytics', dashboard: 'Live-Monitor', flux: '3D-Skulptur', aurora: 'Fluid-Shader', kinetic: 'Feder-Studio', micro: 'Micro-Interaktionen', physics: 'Schwerkraft', orbit: 'Galaxie-Studio', galaxy: 'Shader-Galaxie', morph: 'Partikel-Morphing', palette: 'Typografie', theme: 'Theme-Tokens' },
  groupDescriptions: {
    aura: ['Das Produktstudio.', 'Skulpturale Kopfhörer und ausdrucksstarke Objekte in einem Studio für Form, Material und Licht.'],
    pulse: ['Daten in Bewegung.', 'Ein präzises Analytics-Interface und ein Live-Monitor mit lokal simulierten Daten.'],
    flux: ['Ein Shader-Labor. Zwei Welten.', 'Zwischen einer lebendigen 3D-Skulptur und einem immersiven Fluid-Feld wechseln.'],
    kinetic: ['Der Interaktionsspielplatz.', 'Eine Feder abstimmen, ausdrucksstarke UI-Details erkunden und mit Schwerkraft spielen.'],
    orbit: ['Ein Universum aus Partikeln.', 'Eine Galaxie gestalten, eine Sternenwelle auslösen und Tausende Partikel in neue Formen verwandeln.'],
    palette: ['Das Designstudio.', 'Typografische Poster gestalten und ein visuelles Theme mit Live-CSS-Tokens entwickeln.'],
  },
  descriptions: {
    ...ADDITIONS_DE,
    aura: ['Klang in Form.', 'Ein interaktives Produktstudio. Kopfhörer drehen, das Finish wechseln und den Aufbau entdecken.', 'Drehen Sie das Produkt, wählen Sie ein Finish und erkunden Sie die Explosionsansicht.'],
    folio: ['Eine neue Perspektive.', 'Eine redaktionelle Welt aus Farbe, Komposition und fließenden Übergängen.', 'Entdecken Sie drei gestaltete Szenen, die Layout, Farbe und Stimmung verändern.'],
    pulse: ['Klarheit in den Daten.', 'Ein präzises Analytics-Interface, das komplexe Informationen mühelos zugänglich macht.', 'Wechseln Sie den Zeitraum, erkunden Sie das Diagramm und filtern Sie die Beispieldaten.'],
    flux: ['Eine lebendige Skulptur.', 'Eine wandelbare Studie aus Licht, Oberfläche und generativer Geometrie.', 'Verformen Sie die Oberfläche, wechseln Sie die Farbe und machen Sie die Geometrie sichtbar.'],
    kinetic: ['Ein Impuls. Viele Möglichkeiten.', 'Ein Interaktionsstudio, in dem kleine Gesten ausdrucksstarke Bewegungen auslösen.', 'Ziehen Sie das Objekt oder nutzen Sie die Richtungstasten. Verändern Sie die Feder und beobachten Sie die Reaktion.'],
    atelier: ['Objekte mit Charakter.', 'Ein feines Shopping-Erlebnis mit ausdrucksstarken Produkten und einem klar gestalteten Warenkorb.', 'Entdecken Sie die Objekte, wählen Sie ein Finish und füllen Sie den Demo-Warenkorb. Es wird nichts bestellt.'],
    orbit: ['Ein eigenes kleines Universum.', 'Tausende Partikel verbinden sich zu einer faszinierenden Galaxie.', 'Drehen Sie die Ansicht, ändern Sie die Formation und wählen Sie Ihre Lieblingsfarben.'],
    palette: ['Typografie mit Haltung.', 'Ein Werkzeug für Art Direction. Aus wenigen Worten wird eine markante Komposition.', 'Bearbeiten Sie den Text, verändern Sie die Typografie und vergleichen Sie Layouts und Farben.'],
    relay: ['Arbeit im besten Flow.', 'Ein fokussierter Workspace mit griffigen Karten und durchdachter Interaktion.', 'Erstellen Sie eine Beispielaufgabe, verschieben Sie sie und filtern Sie nach Priorität. Änderungen bleiben in dieser Sitzung.'],
  },
};

export function getLabCopy(locale) {
  return locale === 'en' ? en : de;
}
