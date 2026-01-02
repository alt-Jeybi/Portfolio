import { FiArrowDown, FiMail } from 'react-icons/fi';
import profileData from '../../data/profile.json';
import type { Profile } from '../../types';
import styles from './Hero.module.css';

const profile = profileData as Profile;

// Default placeholder avatar
const PLACEHOLDER_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23e5e7eb"/%3E%3Ccircle cx="50" cy="40" r="20" fill="%239ca3af"/%3E%3Cellipse cx="50" cy="85" rx="30" ry="25" fill="%239ca3af"/%3E%3C/svg%3E';

export function Hero() {
  // Animation is handled via CSS
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_AVATAR;
  };

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.avatarWrapper}>
            <img
              src={profile.avatar || PLACEHOLDER_AVATAR}
              alt={`${profile.name}'s profile photo`}
              className={styles.avatar}
              onError={handleImageError}
              data-testid="hero-avatar"
            />
          </div>
          
          <h1 className={styles.name} data-testid="hero-name">
            {profile.name}
          </h1>
          
          <p className={styles.title} data-testid="hero-title">
            {profile.title}
          </p>
          
          <div className={styles.ctaButtons}>
            <button
              type="button"
              className={styles.ctaPrimary}
              onClick={() => handleScrollToSection('projects')}
              aria-label="View Projects"
            >
              <FiArrowDown aria-hidden="true" />
              View Projects
            </button>
            
            <button
              type="button"
              className={styles.ctaSecondary}
              onClick={() => handleScrollToSection('contact')}
              aria-label="Contact Me"
            >
              <FiMail aria-hidden="true" />
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
