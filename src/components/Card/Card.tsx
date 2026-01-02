import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
}

export function Card({ children, className = '' }: CardProps) {
  const combinedClassName = className 
    ? `${styles.card} ${className}` 
    : styles.card;
  
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}

export function CardHeader({ icon, title }: CardHeaderProps) {
  return (
    <div className={styles.cardHeader}>
      <span className={styles.cardHeaderIcon}>{icon}</span>
      <h2 className={styles.cardHeaderTitle}>{title}</h2>
    </div>
  );
}
