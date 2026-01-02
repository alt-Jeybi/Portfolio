import { FiMail, FiFileText, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import profileData from '../../data/profile.json';
import type { Profile } from '../../types';
import { Card } from '../Card';
import styles from './ProfileHeader.module.css';

const profile = profileData as Profile;

// Default placeholder avatar
const PLACEHOLDER_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23e5e7eb"/%3E%3Ccircle cx="50" cy="40" r="20" fill="%239ca3af"/%3E%3Cellipse cx="50" cy="85" rx="30" ry="25" fill="%239ca3af"/%3E%3C/svg%3E';

export interface ProfileHeaderProps {
  profileOverride?: Profile;
}

export function ProfileHeader({ profileOverride }: ProfileHeaderProps) {
  const data = profileOverride || profile;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_AVATAR;
  };

  return (
    <Card className={styles.profileHeader}>
      <div className={styles.content}>
        <div className={styles.avatarWrapper}>
          <img
            src={data.avatar || PLACEHOLDER_AVATAR}
            alt={`${data.name}'s profile photo`}
            className={styles.avatar}
            onError={handleImageError}
            data-testid="profile-avatar"
          />
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h1 className={styles.name} data-testid="profile-name">
              {data.name}
            </h1>
            {data.verified && (
              <FiCheckCircle 
                className={styles.verifiedBadge} 
                aria-label="Verified"
                data-testid="profile-verified"
              />
            )}
          </div>

          <div className={styles.location} data-testid="profile-location">
            <FiMapPin className={styles.locationIcon} aria-hidden="true" />
            <span>{data.location}</span>
          </div>

          <p className={styles.title} data-testid="profile-title">
            {data.title}
          </p>
        </div>

        <div className={styles.actions}>
          <a
            href={data.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
            data-testid="profile-resume-btn"
          >
            <FiFileText aria-hidden="true" />
            View Resume
          </a>

          <a
            href={`mailto:${data.email}`}
            className={styles.btnSecondary}
            data-testid="profile-email-btn"
          >
            <FiMail aria-hidden="true" />
            Send Email
          </a>
        </div>
      </div>
    </Card>
  );
}

export default ProfileHeader;
