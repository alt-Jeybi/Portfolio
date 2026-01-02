import skillsData from '../../data/skills.json';
import type { SkillCategory } from '../../types';
import { SkillCard } from './SkillCard';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './Skills.module.css';

const categories = skillsData.categories as SkillCategory[];

export function Skills() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section 
      id="skills" 
      className={`${styles.skills} ${isVisible ? styles.visible : ''}`} 
      aria-label="Skills"
      ref={ref}
    >
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Skills & Technologies</h2>
        <p className={styles.sectionSubtitle}>
          Technologies I work with to bring ideas to life
        </p>

        <div className={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={styles.categoryCard}
              data-testid="skill-category"
              style={{ animationDelay: `${0.1 + index * 0.15}s` }}
            >
              <h3
                className={styles.categoryTitle}
                data-testid="category-title"
              >
                {category.displayName}
              </h3>
              <div className={styles.skillsGrid}>
                {category.skills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
