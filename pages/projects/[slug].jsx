import ProjectCase from "../../components/ProjectCase";
import { PROJECTS } from "../../lib/projects";

export default function ProjectPage({ slug }) {
  return <ProjectCase slug={slug} />;
}

// Generate every slug for EVERY configured locale (de + en).
// Returning paths without `locale` only prerendered the default locale,
// which made /en/projects/* return 404.
export function getStaticPaths({ locales }) {
  const paths = PROJECTS.flatMap((project) =>
    locales.map((locale) => ({ params: { slug: project.slug }, locale })),
  );
  return { paths, fallback: false };
}

export function getStaticProps({ params }) {
  if (!PROJECTS.some((p) => p.slug === params.slug)) {
    return { notFound: true };
  }
  return { props: { slug: params.slug } };
}
