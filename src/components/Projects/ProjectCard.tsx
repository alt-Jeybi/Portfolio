import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import type { Project } from '../../types';
import styles from './Projects.module.css';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.projectCard} data-testid="project-card">
      <div className={styles.thumbnailWrapper}>
        <img
          src={project.thumbnail}
          alt={`${project.title} thumbnail`}
          className={styles.thumbnail}
          loading="lazy"
          data-testid="project-thumbnail"
        />
        <div className={styles.overlay}>
          <div className={styles.links}>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                data-testid="live-link"
                aria-label={`View live demo of ${project.title}`}
              >
                <FaExternalLinkAlt />
                <span>Live Demo</span>
              </a>
            ) : (
              <span
                className={`${styles.link} ${styles.linkDisabled}`}
                data-testid="live-link-disabled"
                aria-label="Live demo not available"
              >
                <FaExternalLinkAlt />
                <span>Demo N/A</span>
              </span>
            )}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                data-testid="repo-link"
                aria-label={`View source code of ${project.title}`}
              >
                <FaGithub />
                <span>Source</span>
              </a>
            ) : (
              <span
                className={`${styles.link} ${styles.linkDisabled}`}
                data-testid="repo-link-disabled"
                aria-label="Source code not available"
              >
                <FaGithub />
                <span>Source N/A</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title} data-testid="project-title">
          {project.title}
        </h3>
        <p className={styles.description} data-testid="project-description">
          {project.description}
        </p>
        <div className={styles.technologies} data-testid="project-technologies">
          {project.technologies.map((tech) => (
            <span key={tech} className={styles.tech}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
