import {
  FaReact,
  FaVuejs,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaGitAlt,
  FaApple,
  FaAndroid,
  FaFigma,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiGraphql,
  SiFlutter,
  SiJest,
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { TbApi } from 'react-icons/tb';
import type { Skill } from '../../types';
import styles from './Skills.module.css';

// Map icon names to React Icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  react: FaReact,
  typescript: SiTypescript,
  vuejs: FaVuejs,
  html5: FaHtml5,
  css3: FaCss3Alt,
  tailwind: SiTailwindcss,
  nodejs: FaNodeJs,
  express: SiExpress,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  api: TbApi,
  graphql: SiGraphql,
  flutter: SiFlutter,
  apple: FaApple,
  android: FaAndroid,
  git: FaGitAlt,
  docker: FaDocker,
  aws: FaAws,
  figma: FaFigma,
  vscode: VscCode,
  jest: SiJest,
};

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const IconComponent = iconMap[skill.icon];

  return (
    <div className={styles.skillCard} data-testid="skill-card">
      <div className={styles.skillIcon} data-testid="skill-icon">
        {IconComponent ? (
          <IconComponent className={styles.icon} />
        ) : (
          <span className={styles.iconFallback}>{skill.name.charAt(0)}</span>
        )}
      </div>
      <span className={styles.skillName} data-testid="skill-name">
        {skill.name}
      </span>
    </div>
  );
}

export default SkillCard;
