import { Card, CardHeader } from '../Card';
import skillsData from '../../data/skills.json';
import type { TechStackData, SkillCategory } from '../../types';
import styles from './TechStack.module.css';

const techStack = skillsData as TechStackData;

// Code icon SVG component
function CodeIcon() {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

interface SkillCategoryProps {
  category: SkillCategory;
}

function SkillCategorySection({ category }: SkillCategoryProps) {
  return (
    <div className={styles.category} data-testid="skill-category">
      <h3 className={styles.categoryName} data-testid="category-name">
        {category.name}
      </h3>
      <div className={styles.skills}>
        {category.skills.map((skill) => (
          <span
            key={skill.name}
            className={styles.skillTag}
            data-testid="skill-tag"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  return (
    <Card className={styles.techStackCard}>
      <CardHeader icon={<CodeIcon />} title="Tech Stack" />
      <div className={styles.categories} data-testid="tech-stack-categories">
        {techStack.categories.map((category) => (
          <SkillCategorySection key={category.id} category={category} />
        ))}
      </div>
    </Card>
  );
}

export default TechStack;
