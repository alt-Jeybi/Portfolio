import { Card, CardHeader } from '../Card';
import certificationsData from '../../data/certifications.json';
import type { Certification } from '../../types';
import styles from './Certifications.module.css';

const MAX_CERTIFICATIONS = 5;

// Checkmark icon SVG component
function CheckmarkIcon() {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// Limit display to 5 certifications maximum
const displayCertifications = (certificationsData.certifications as Certification[]).slice(0, MAX_CERTIFICATIONS);

interface CertificationItemProps {
  certification: Certification;
}

function CertificationItem({ certification }: CertificationItemProps) {
  return (
    <li className={styles.certificationItem} data-testid="certification-item">
      <span className={styles.certificationName} data-testid="certification-name">
        {certification.name}
      </span>
      <span className={styles.certificationIssuer} data-testid="certification-issuer">
        {certification.issuer}
      </span>
    </li>
  );
}

export function Certifications() {
  return (
    <Card className={styles.certificationsCard}>
      <CardHeader icon={<CheckmarkIcon />} title="Recent Certifications" />
      <ul className={styles.certificationsList} data-testid="certifications-list">
        {displayCertifications.map((certification) => (
          <CertificationItem key={certification.id} certification={certification} />
        ))}
      </ul>
    </Card>
  );
}

export default Certifications;
