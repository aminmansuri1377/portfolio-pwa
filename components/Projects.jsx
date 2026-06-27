import Image from "next/image";
import Link from "next/link";
import React from "react";
import propertyImg from "../public/assets/projects/shoplonland.jpg";
import cryptoImg from "../public/assets/projects/mag.jpg";
import netflixImg from "../public/assets/projects/planet.jpg";
import zinamatv from "../public/assets/projects/zeenamatv.png";
import rentta from "../public/assets/projects/rentta.png";
import twitchImg from "../public/assets/projects/twitch.jpg";
import ProjectItem from "./ProjectItem";
import ProjectsSlider from "./ProjectsSlider";
const projects = [
  {
    title: "shoplon",
    backgroundImg: propertyImg,
    projectUrl: "/shoplon",
    tech: "Next JS",
  },
  {
    title: "magreach dashboard",
    backgroundImg: cryptoImg,
    projectUrl: "/magreach",
    tech: "Next JS",
  },
  {
    title: "gamePlanet",
    backgroundImg: netflixImg,
    projectUrl: "/gamePlanet",
    tech: "Next JS",
  },
  {
    title: "zinamatv",
    backgroundImg: zinamatv,
    projectUrl: "/zinamatv",
    tech: "Next JS",
  },
  {
    title: "rentta",
    backgroundImg: rentta,
    projectUrl: "/rentta",
    tech: "Next JS",
  },
];
const Projects = () => {
  return (
    <div id="projects" className="w-full">
      <div className="max-w-[1240px] mx-auto px-2 py-16">
        <p className="text-xl tracking-widest uppercase text-[#5651e5]">
          Projects
        </p>
        <h2 className="py-4">What I&apos;ve Built</h2>
        <ProjectsSlider>
          <div className="flex gap-6 w-max">
            {[...projects, ...projects].map((project, index) => (
              <div key={index} className="max-w-[500px] flex-shrink-0">
                <ProjectItem {...project} />
              </div>
            ))}
          </div>
        </ProjectsSlider>
      </div>
    </div>
  );
};

export default Projects;
