import ProjectCase from '../../components/ProjectCase';
import { PROJECTS } from '../../lib/projects';

export default function ProjectPage({ slug }) {
  return <ProjectCase slug={slug} />;
}

export function getStaticPaths() {
  return {
    paths: PROJECTS.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
