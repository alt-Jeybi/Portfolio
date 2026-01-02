import { FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { FaFacebookMessenger } from 'react-icons/fa';
import { Card, CardHeader } from '../Card';
import profileData from '../../data/profile.json';
import type { Profile } from '../../types';
import styles from './Contact.module.css';

const profile = profileData as Profile;

// Message icon for CardHeader
function MessageIcon() {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

interface ContactProps {
  email?: string;
  phone?: string;
  messengerUrl?: string;
  availabilityText?: string;
}

export function Contact({
  email = profile.email,
  phone = profile.phone,
  messengerUrl = profile.messengerUrl,
  availabilityText = "Actively seeking an OJT/Internship opportunity"
}: ContactProps) {
  return (
    <Card className={styles.contactCard}>
      <CardHeader icon={<MessageIcon />} title="Contact" />
      
      <div className={styles.contactContent}>
        <p className={styles.availabilityText} data-testid="availability-text">
          {availabilityText}
        </p>
        
        <a 
          href={`mailto:${email}`} 
          className={styles.ctaLink}
          data-testid="cta-link"
        >
          Get in touch →
        </a>
        
        <div className={styles.contactButtons}>
          <a
            href={`mailto:${email}`}
            className={styles.contactButton}
            data-testid="contact-email"
            aria-label="Send email"
          >
            <FiMail className={styles.contactIcon} />
            <span className={styles.contactLabel}>Email</span>
          </a>
          
          <a
            href={`tel:${phone}`}
            className={styles.contactButton}
            data-testid="contact-phone"
            aria-label="Call phone"
          >
            <FiPhone className={styles.contactIcon} />
            <span className={styles.contactLabel}>Let's Talk</span>
          </a>
          
          <a
            href={messengerUrl}
            className={styles.contactButton}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="contact-messenger"
            aria-label="Message on Messenger"
          >
            <FaFacebookMessenger className={styles.contactIcon} />
            <span className={styles.contactLabel}>Messenger</span>
          </a>
        </div>
      </div>
    </Card>
  );
}

export default Contact;
