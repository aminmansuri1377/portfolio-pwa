# Visual Lab — merged edition

Frontend-only extension to `aminmansuri1377/portfolio-pwa`.
Routes: `/lab` (German) and `/en/lab` (English).

This edition combines the original nine studies with all twelve studies from
`visual-lab(2).patch`. Related features share a studio, so the gallery has
**13 distinct studios and 21 interactive modes**, not 21 overlapping cards.
The supplied lime/violet 3D ring tunnel is the new hero background. The home
entrance uses the supplied animated CSS cube, and the header uses its pill link.

## Installation — choose one patch

Base repository commit: `996c0650ed36da50f7e03d78f2ba6a58685136c6` on `main`.

### Original repository, without the earlier Visual Lab patch

Apply the complete edition. It supersedes both earlier patch files:

```sh
git apply --check portfolio-visual-lab-merged.patch
git apply portfolio-visual-lab-merged.patch
npm ci
npm run build
npm run dev
```

### Earlier nine-demo patch already applied

Use the upgrade patch instead of the complete patch:

```sh
git apply --check portfolio-visual-lab-upgrade.patch
git apply portfolio-visual-lab-upgrade.patch
npm run build
npm run dev
```

The upgrade expects the exact earlier `portfolio-visual-lab.patch`. It works
whether those earlier changes are committed or still in the working tree.
Do not apply both delivery files. If the check fails, compare your local changes
to the stated baseline instead of forcing the patch or discarding your work.
The supplied `/showcase` patch is integrated into `/lab`; do not also apply it.

No new dependencies, API routes, database, environment variables, remote models,
remote images or hosting configuration are required. The site's existing
`next/font` configuration retains its normal clean-build font requirements.

## Consolidated studios

| Studio | Modes | What is demonstrated |
| --- | --- | --- |
| AURA | Headphones; materials & shapes | Product configuration, finishes, exploded view, PBR and lighting |
| FOLIO | Editorial gallery | Vector art direction and choreographed scene transitions |
| PULSE | Analytics; live monitor | Search, filters, illustrative transactions and simulated SVG charts |
| FLUX | 3D sculpture; fluid shader | Surface deformation and a full-screen domain-warped shader |
| KINETIC | Spring studio; micro-interactions; gravity | Spring tuning, expressive UI details and Verlet collisions |
| ATELIER | Sample storefront | Product finishes, bag variants, coupon and exact local totals |
| ORBIT | Galaxy studio; shader galaxy; particle morph | Galaxy controls, 60,000 shader stars and 9,000 morphing particles |
| PALETTE | Typography; theme tokens | Poster composition, typography controls and CSS variable export |
| RELAY | Kanban workspace | Drag and drop, accessible status menus and local task state |
| MATRIX | Wave matrix | 2,304 instanced cubes and pointer raycasting |
| PLANET | Procedural planet | Shader terrain, sea level, atmosphere and regenerated worlds |
| COMMAND | Command palette | Fuzzy search, keyboard navigation and live interface commands |
| FLOW | Flow-field art | Canvas particle trails, palette changes and pointer forces |

The old typographic PALETTE and the supplied command palette are different tools.
The command palette uses `command` as its view ID; both remain available.
These are frontend concept studies. Product, task and analytics data are
illustrative, and the live monitor explicitly labels its local simulation.
No purchase, task or analytics data is sent to a backend. State resets when a
mode is unmounted. Clipboard buttons expose selectable text if access fails.

## Preserved routes and links

All 21 view IDs remain valid, including views consolidated into a studio.
For example, `/en/lab?demo=galaxy` opens ORBIT with the shader-galaxy mode selected;
`/en/lab?demo=theme` opens PALETTE with its theme studio selected.
The copy-link action always links to the current mode. Previous/next moves
between the 13 studios. The visible mode buttons switch within a studio.

## Integration and structure

Only two files from the original repository are edited:

- `pages/index.js`: entrance between Projects and Contact.
- `components/layout/Navbar.jsx`: Visual Lab link on desktop and mobile.

Existing portfolio content, project pages, original home hero, footer, global
styles, global messages, PWA files, configuration and dependencies are unchanged.
The entrance cube uses CSS instead of another WebGL context on the home page.

Key files:

- `lib/lab.js`: 13-studio catalog, 21-view routing, gallery and mode labels.
- `lib/lab-additions.js`: imported metadata and localized descriptions.
- `components/lab/VisualLab.jsx`: gallery, hero integration and route state.
- `components/lab/LabDialog.jsx`: native dialog, mode selector, direct links.
- `components/lab/{spatial,frontend,interfaces}`: the original nine studies.
- `components/showcase/HeroTunnel.jsx`: the supplied 30-ring 3D tunnel.
- `components/showcase/{Graphics,Runtime}.jsx`: graphics guard and motion lifecycle.
- `components/showcase/ShowcaseDemo.jsx`: individual lazy imports for additions.
- `components/showcase/demos`: all twelve supplied studies, adapted to the host.
- `components/showcase/messages`: isolated English and German demo translations.
- `components/sections/VisualLabSection.jsx`: the supplied CSS-cube invitation.
- CSS Modules isolate the extension's styles from the existing portfolio.

## Behavior and performance

- The new studies are split into separate dynamic imports. Switching modes
  unmounts the previous renderer; gallery covers use CSS/SVG.
- The hero unmounts while a studio is open. Hidden tabs pause animation loops;
  the hero also pauses when outside the viewport. Device pixel ratio is capped.
- Motion can be paused from the gallery or the open dialog. System reduced-motion
  preferences take precedence. Canvas artwork retains a still preview, and the
  physics demo offers an explicit single-frame advance while paused.
- Planet/morph controls explicitly invalidate demand rendering when changed.
- The native dialog traps focus, makes the background inert, restores focus and
  coordinates with the existing Lenis scroll behavior.
- Escape closes the inner command palette before closing its parent studio.
- Physics controls occupy their own row so resting balls remain reachable on
  narrow screens. Shared controls use responsive wrapping and visible focus.
- WebGL 2 is probed before mounting a renderer. Unsupported or lost contexts show
  an illustrated preview with a retry option. The decorative hero has a matching
  static ring-tunnel fallback. The original three studies retain their own
  fallbacks and supported preview controls.

## Verification and limits

The merged implementation passes Next.js production compilation and ESLint with
its existing lockfile. Delivery verification checks both a clean base + complete
patch and the previous edition + upgrade patch, including identical final trees.
Catalog checks cover 13 unique studios, 21 unique routed views, one studio owner
per view, both translations, and preserved deep links.

The original nine-demo edition was inspected in a browser during its creation.
The browser preview for this merged edition could not be opened in the current
review environment. Consequently, the new visual appearance, GPU shader runtime
and browser interactions are not claimed as browser-verified. The code and
resource lifecycle were reviewed independently; production compilation does not
replace visual GPU testing on a WebGL 2-capable device.

## References

The earlier studies drew general interaction/composition inspiration from:

- https://bruno-simon.com/
- https://v2.lusion.co/work/gemini/
- https://linear.app/now/behind-the-latest-design-refresh
- https://threejs.org/manual/pages/rendering-on-demand.html

The twelve additional studies, tunnel, cube invitation and header treatment are
adapted from the patch supplied for this merge. No site has been published and
no GitHub commit or pull request has been created by applying this local work.
