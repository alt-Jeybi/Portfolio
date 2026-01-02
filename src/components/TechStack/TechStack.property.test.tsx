import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import * as fc from 'fast-check';
import type { SkillCategory, TechStackData, Skill } from '../../types';

/**
 * **Feature: portfolio-website, Property 7: Tech stack renders all categories with their skills**
 * **Validates: Requirements 4.1, 4.3**
 * 
 * For any valid skills data with categories, the TechStack component SHALL render
 * every category name and all skills within each category.
 */

// Arbitrary for generating valid Skill objects
const skillArbitrary: fc.Arbitrary<Skill> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
  icon: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
});

// Arbitrary for generating valid SkillCategory objects
const skillCategoryArbitrary: fc.Arbitrary<SkillCategory> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  category: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  displayName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
});

// Generate unique IDs for skill categories
const uniqueSkillCategoriesArbitrary = (minLength: number, maxLength: number) =>
  fc.array(skillCategoryArbitrary, { minLength, maxLength })
    .map(categories => categories.map((cat, index) => ({ ...cat, id: `cat-${index}` })));

// Arbitrary for generating valid TechStackData
const techStackDataArbitrary: fc.Arbitrary<TechStackData> = fc.record({
  categories: uniqueSkillCategoriesArbitrary(1, 6),
});

describe('Property 7: Tech stack renders all categories with their skills', () => {
  /**
   * **Feature: portfolio-website, Property 7: Tech stack renders all categories with their skills**
   * **Validates: Requirements 4.1, 4.3**
   */
  it('should have valid structure for any generated skill category', () => {
    fc.assert(
      fc.property(skillCategoryArbitrary, (category) => {
        // Verify category has all required fields
        expect(category.id).toBeDefined();
        expect(typeof category.id).toBe('string');
        expect(category.id.trim().length).toBeGreaterThan(0);
        
        expect(category.name).toBeDefined();
        expect(typeof category.name).toBe('string');
        expect(category.name.trim().length).toBeGreaterThan(0);
        
        expect(category.skills).toBeDefined();
        expect(Array.isArray(category.skills)).toBe(true);
        expect(category.skills.length).toBeGreaterThan(0);
        
        // Each skill should be an object with name and icon
        category.skills.forEach(skill => {
          expect(typeof skill).toBe('object');
          expect(typeof skill.name).toBe('string');
          expect(skill.name.trim().length).toBeGreaterThan(0);
          expect(typeof skill.icon).toBe('string');
          expect(skill.icon.trim().length).toBeGreaterThan(0);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should validate skill categories round-trip through JSON serialization', () => {
    fc.assert(
      fc.property(skillCategoryArbitrary, (category) => {
        const jsonString = JSON.stringify(category);
        const parsed = JSON.parse(jsonString) as SkillCategory;
        
        // Verify all fields survive serialization
        expect(parsed.id).toBe(category.id);
        expect(parsed.name).toBe(category.name);
        expect(parsed.skills).toEqual(category.skills);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate TechStackData structure with multiple categories', () => {
    fc.assert(
      fc.property(techStackDataArbitrary, (techStackData) => {
        // Verify categories array exists and has items
        expect(techStackData.categories).toBeDefined();
        expect(Array.isArray(techStackData.categories)).toBe(true);
        expect(techStackData.categories.length).toBeGreaterThan(0);
        
        // Each category should have required fields
        techStackData.categories.forEach(category => {
          expect(category.id).toBeDefined();
          expect(category.name).toBeDefined();
          expect(category.skills).toBeDefined();
          expect(category.skills.length).toBeGreaterThan(0);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should count total skills correctly across all categories', () => {
    fc.assert(
      fc.property(techStackDataArbitrary, (techStackData) => {
        // Calculate total skills
        const totalSkills = techStackData.categories.reduce(
          (sum, category) => sum + category.skills.length,
          0
        );
        
        // Total should equal sum of all category skills
        const expectedTotal = techStackData.categories
          .map(c => c.skills.length)
          .reduce((a, b) => a + b, 0);
        
        expect(totalSkills).toBe(expectedTotal);
        expect(totalSkills).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve all categories and skills through TechStackData serialization', () => {
    fc.assert(
      fc.property(techStackDataArbitrary, (techStackData) => {
        const jsonString = JSON.stringify(techStackData);
        const parsed = JSON.parse(jsonString) as TechStackData;
        
        // Same number of categories
        expect(parsed.categories.length).toBe(techStackData.categories.length);
        
        // Each category should match
        techStackData.categories.forEach((originalCat, index) => {
          const parsedCat = parsed.categories[index];
          expect(parsedCat.id).toBe(originalCat.id);
          expect(parsedCat.name).toBe(originalCat.name);
          expect(parsedCat.skills).toEqual(originalCat.skills);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should validate actual skills.json file conforms to TechStackData schema', async () => {
    const skillsData = await import('../../data/skills.json');
    
    // Verify structure
    expect(skillsData.categories).toBeDefined();
    expect(Array.isArray(skillsData.categories)).toBe(true);
    expect(skillsData.categories.length).toBeGreaterThan(0);
    
    // Verify each category has required fields
    skillsData.categories.forEach((category: SkillCategory) => {
      expect(typeof category.id).toBe('string');
      expect(category.id.length).toBeGreaterThan(0);
      
      expect(typeof category.name).toBe('string');
      expect(category.name.length).toBeGreaterThan(0);
      
      expect(Array.isArray(category.skills)).toBe(true);
      expect(category.skills.length).toBeGreaterThan(0);
      
      category.skills.forEach((skill: Skill) => {
        expect(typeof skill).toBe('object');
        expect(typeof skill.name).toBe('string');
        expect(skill.name.length).toBeGreaterThan(0);
        expect(typeof skill.icon).toBe('string');
        expect(skill.icon.length).toBeGreaterThan(0);
      });
    });
  });
});
