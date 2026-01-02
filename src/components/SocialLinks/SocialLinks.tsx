import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { Card, CardHeader } from '../Card';
import profileData from '../../data/profile.json';
import type { Profile, SocialLink } from '../../types';
import styles from './SocialLinks.module.css';

const profile = profileData as Profile;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
};

const labelMap: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
};

interface SocialLinksProps {
  links?: SocialLink[];
}

export function SocialLinks({ links = profile.socialLinks }: SocialLinksProps) {
  return (
    <Card className={styles.socialLinksCard}>
      <CardHeader icon={<FiLink />} title="Social Links" />
      <div className={styles.socialButtonsContainer}>
        {links.map((link) => {
          const Icon = iconMap[link.platform];
          const label = labelMap[link.platform];
          
          return (
            <a
              key={link.platform}
              href={link.url}
              className={styles.socialButton}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              data-testid={`social-link-${link.platform}`}
            >
              <Icon className={styles.socialIcon} />
              <span className={styles.socialLabel}>{label}</span>
            </a>
          );
        })}
      </div>
    </Card>
  );
}

export default SocialLinks;
