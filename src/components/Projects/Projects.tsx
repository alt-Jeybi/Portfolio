import { Card, CardHeader } from '../Card';
import projectsData from '../../data/projects.json';
import type { Project } from '../../types';
import styles from './Projects.module.css';

const MAX_PROJECTS = 6;

// Grid icon SVG component
function GridIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

// Limit display to 6 projects maximum
const displayProjects = (projectsData.projects as Project[]).slice(0, MAX_PROJECTS);

interface ProjectItemProps {
  project: Project;
}

function ProjectItem({ project }: ProjectItemProps) {
  // Use liveUrl if available, otherwise use repoUrl
  const projectUrl = project.liveUrl || project.repoUrl || '#';
  
  return (
    <div className={styles.projectItem} data-testid="project-item">
      <h3 className={styles.projectName} data-testid="project-name">
        {project.title}
      </h3>
      <p className={styles.projectDescription} data-testid="project-description">
        {project.description}
      </p>
      <a
        href={projectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.projectLink}
        data-testid="project-link"
        aria-label={`View ${project.title} project`}
      >
        View Project →
      </a>
    </div>
  );
}

export function Projects() {
  return (
    <Card className={styles.projectsCard}>
      <CardHeader icon={<GridIcon />} title="Recent Projects" />
      <div className={styles.projectsGrid} data-testid="projects-grid">
        {displayProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </Card>
  );
}

export default Projects;
