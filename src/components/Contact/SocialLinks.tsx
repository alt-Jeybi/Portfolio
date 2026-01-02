import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter, FaInstagram } from 'react-icons/fa';
import type { SocialLink } from '../../types';
import styles from './Contact.module.css';

interface SocialLinksProps {
  links: SocialLink[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FaEnvelope,
  twitter: FaTwitter,
  instagram: FaInstagram,
};

const labelMap: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  email: 'Email',
  twitter: 'Twitter',
  instagram: 'Instagram',
};

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className={styles.socialLinks} data-testid="social-links">
      <h3 className={styles.socialTitle}>Connect With Me</h3>
      <div className={styles.socialIconsContainer}>
        {links.map((link) => {
          const Icon = iconMap[link.platform];
          const label = labelMap[link.platform];
          
          return (
            <a
              key={link.platform}
              href={link.url}
              className={styles.socialLink}
              target={link.platform === 'email' ? undefined : '_blank'}
              rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
              aria-label={label}
              data-testid={`social-link-${link.platform}`}
            >
              <Icon className={styles.socialIcon} />
              <span className={styles.socialLabel}>{label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default SocialLinks;
