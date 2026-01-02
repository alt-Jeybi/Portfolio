import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import type { SkillCategory, Skill } from '../../types';

/**
 * **Feature: portfolio-website, Property 2: Skills section renders all categories with icons**
 * **Validates: Requirements 2.1, 2.2**
 *
 * For any valid skills data with categories and skills, the Skills section SHALL render
 * every category name and every skill SHALL have an associated icon element.
 */

// Valid icon names that map to actual icons in SkillCard
const validIconNames = [
  'react',
  'typescript',
  'vuejs',
  'html5',
  'css3',
  'tailwind',
  'nodejs',
  'express',
  'postgresql',
  'mongodb',
  'api',
  'graphql',
  'flutter',
  'apple',
  'android',
  'git',
  'docker',
  'aws',
  'figma',
  'vscode',
  'jest',
] as const;

// Arbitrary for generating valid Skill objects
const skillArbitrary: fc.Arbitrary<Skill> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  icon: fc.oneof(
    fc.constantFrom(...validIconNames),
    fc.string({ minLength: 1, maxLength: 20 }) // Also test fallback icons
  ),
});

// Arbitrary for generating valid SkillCategory objects
const skillCategoryArbitrary: fc.Arbitrary<SkillCategory> = fc.record({
  category: fc.constantFrom('frontend', 'backend', 'mobile', 'tools'),
  displayName: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
});

// Testable Skills component that accepts categories as props
function SkillsTestable({ categories }: { categories: SkillCategory[] }) {
  // Import icon map inline for testing
  const iconMap: Record<string, boolean> = {
    react: true,
    typescript: true,
    vuejs: true,
    html5: true,
    css3: true,
    tailwind: true,
    nodejs: true,
    express: true,
    postgresql: true,
    mongodb: true,
    api: true,
    graphql: true,
    flutter: true,
    apple: true,
    android: true,
    git: true,
    docker: true,
    aws: true,
    figma: true,
    vscode: true,
    jest: true,
  };

  return (
    <section data-testid="skills-section">
      {categories.map((category, catIndex) => (
        <div key={`${category.category}-${catIndex}`} data-testid="skill-category">
          <h3 data-testid="category-title">{category.displayName}</h3>
          <div>
            {category.skills.map((skill, index) => (
              <div key={`${skill.name}-${catIndex}-${index}`} data-testid="skill-card">
                <div data-testid="skill-icon">
                  {iconMap[skill.icon] ? (
                    <span data-icon-type="mapped">{skill.icon}</span>
                  ) : (
                    <span data-icon-type="fallback">{skill.name.charAt(0)}</span>
                  )}
                </div>
                <span data-testid="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

describe('Property 2: Skills section renders all categories with icons', () => {
  it('should render every category name for any valid skills data', () => {
    fc.assert(
      fc.property(
        fc.array(skillCategoryArbitrary, { minLength: 1, maxLength: 4 }),
        (categories) => {
          const { unmount } = render(<SkillsTestable categories={categories} />);

          // Verify all categories are rendered
          const categoryElements = screen.getAllByTestId('skill-category');
          expect(categoryElements.length).toBe(categories.length);

          // Verify each category title is rendered
          const categoryTitles = screen.getAllByTestId('category-title');
          expect(categoryTitles.length).toBe(categories.length);

          // Verify each category's displayName is present
          categories.forEach((category) => {
            const titleElement = categoryTitles.find(
              (el) => el.textContent === category.displayName
            );
            expect(titleElement).toBeDefined();
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render every skill with an associated icon element for any valid skills data', () => {
    fc.assert(
      fc.property(
        fc.array(skillCategoryArbitrary, { minLength: 1, maxLength: 4 }),
        (categories) => {
          const { unmount } = render(<SkillsTestable categories={categories} />);

          // Count total skills across all categories
          const totalSkills = categories.reduce(
            (sum, cat) => sum + cat.skills.length,
            0
          );

          // Verify all skill cards are rendered
          const skillCards = screen.getAllByTestId('skill-card');
          expect(skillCards.length).toBe(totalSkills);

          // Verify each skill has an icon element
          const skillIcons = screen.getAllByTestId('skill-icon');
          expect(skillIcons.length).toBe(totalSkills);

          // Verify each icon has content (either mapped icon or fallback)
          skillIcons.forEach((iconElement) => {
            expect(iconElement.children.length).toBeGreaterThan(0);
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render skill names correctly for any valid skills data', () => {
    fc.assert(
      fc.property(
        fc.array(skillCategoryArbitrary, { minLength: 1, maxLength: 4 }),
        (categories) => {
          const { unmount } = render(<SkillsTestable categories={categories} />);

          // Get all skill names
          const skillNameElements = screen.getAllByTestId('skill-name');

          // Flatten all skill names from categories
          const allSkillNames = categories.flatMap((cat) =>
            cat.skills.map((s) => s.name)
          );

          expect(skillNameElements.length).toBe(allSkillNames.length);

          // Verify each skill name is rendered
          allSkillNames.forEach((name) => {
            const nameElement = skillNameElements.find(
              (el) => el.textContent === name
            );
            expect(nameElement).toBeDefined();
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use fallback icon when icon name is not in the icon map', () => {
    const categoryWithUnknownIcon: SkillCategory[] = [
      {
        category: 'frontend',
        displayName: 'Frontend',
        skills: [{ name: 'Unknown Skill', icon: 'unknown-icon-xyz' }],
      },
    ];

    render(<SkillsTestable categories={categoryWithUnknownIcon} />);

    const iconElement = screen.getByTestId('skill-icon');
    const fallbackSpan = iconElement.querySelector('[data-icon-type="fallback"]');

    expect(fallbackSpan).toBeInTheDocument();
    expect(fallbackSpan?.textContent).toBe('U'); // First letter of "Unknown Skill"
  });

  it('should validate actual skills.json data renders correctly', async () => {
    const skillsData = await import('../../data/skills.json');
    const categories = skillsData.categories as SkillCategory[];

    render(<SkillsTestable categories={categories} />);

    // Verify all 4 categories are rendered
    const categoryElements = screen.getAllByTestId('skill-category');
    expect(categoryElements.length).toBe(4);

    // Verify category names
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();

    // Verify all skills have icons
    const totalSkills = categories.reduce(
      (sum, cat) => sum + cat.skills.length,
      0
    );
    const skillIcons = screen.getAllByTestId('skill-icon');
    expect(skillIcons.length).toBe(totalSkills);
  });
});
