import { Card, CardHeader } from '../Card';
import profileData from '../../data/profile.json';
import type { Profile, ExperienceEntry } from '../../types';
import styles from './Experience.module.css';

const profile = profileData as Profile;

// Briefcase icon SVG component
function BriefcaseIcon() {
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

/**
 * Sorts experience entries by year in descending order (most recent first)
 */
export function sortExperienceByYear(entries: ExperienceEntry[]): ExperienceEntry[] {
  return [...entries].sort((a, b) => b.year - a.year);
}

interface TimelineEntryProps {
  entry: ExperienceEntry;
}

function TimelineEntry({ entry }: TimelineEntryProps) {
  return (
    <div className={styles.timelineEntry} data-testid="timeline-entry">
      <div className={styles.markerContainer}>
        <div 
          className={`${styles.marker} ${entry.isCurrent ? styles.markerCurrent : ''}`}
          data-testid={entry.isCurrent ? 'marker-current' : 'marker'}
          aria-label={entry.isCurrent ? 'Current position' : 'Past position'}
        />
        <div className={styles.line} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title} data-testid="entry-title">{entry.title}</h3>
          <span className={styles.year} data-testid="entry-year">{entry.year}</span>
        </div>
        <p className={styles.description} data-testid="entry-description">{entry.description}</p>
      </div>
    </div>
  );
}

export function Experience() {
  const sortedExperience = sortExperienceByYear(profile.experience);

  return (
    <Card className={styles.experienceCard}>
      <CardHeader icon={<BriefcaseIcon />} title="Experience" />
      <div className={styles.timeline} data-testid="experience-timeline">
        {sortedExperience.map((entry) => (
          <TimelineEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </Card>
  );
}

export default Experience;
