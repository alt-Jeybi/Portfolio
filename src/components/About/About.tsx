import { Card, CardHeader } from '../Card';
import profileData from '../../data/profile.json';
import type { Profile } from '../../types';
import styles from './About.module.css';

const profile = profileData as Profile;

/**
 * Validates that a bio text has between 100 and 300 words
 */
export function isValidBioWordCount(text: string): boolean {
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  return wordCount >= 100 && wordCount <= 300;
}

// Home icon SVG component
function HomeIcon() {
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
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function About() {
  return (
    <Card className={styles.aboutCard}>
      <CardHeader icon={<HomeIcon />} title="About" />
      <div className={styles.biography} data-testid="biography">
        {profile.bio.map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
}

export default About;
