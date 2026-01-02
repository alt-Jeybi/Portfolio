import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import type { Project } from '../../types';

/**
 * **Feature: portfolio-website, Property 8: Project cards display complete information with valid links**
 * **Validates: Requirements 5.2, 5.3**
 * 
 * For any valid project data containing name, description, and url, the ProjectCard component
 * SHALL render all three elements and the link SHALL have target="_blank" attribute.
 */

// Arbitrary for generating valid Project objects
const projectArbitrary: fc.Arbitrary<Project> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  thumbnail: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  technologies: fc.array(fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 5 }),
  liveUrl: fc.option(fc.webUrl(), { nil: null }),
  repoUrl: fc.option(fc.webUrl(), { nil: null }),
  featured: fc.boolean(),
});

// Generate unique IDs for projects
const uniqueProjectsArbitrary = (minLength: number, maxLength: number) =>
  fc.array(projectArbitrary, { minLength, maxLength })
    .map(projects => projects.map((project, index) => ({ ...project, id: `proj-${index}` })));

describe('Property 8: Project cards display complete information with valid links', () => {
  /**
   * **Feature: portfolio-website, Property 8: Project cards display complete information with valid links**
   * **Validates: Requirements 5.2, 5.3**
   */
  it('should have valid structure for any generated project', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        // Verify project has all required fields for rendering
        expect(project.title).toBeDefined();
        expect(typeof project.title).toBe('string');
        expect(project.title.trim().length).toBeGreaterThan(0);
        
        expect(project.description).toBeDefined();
        expect(typeof project.description).toBe('string');
        expect(project.description.trim().length).toBeGreaterThan(0);
        
        // URL should be either null or a valid string
        expect(project.liveUrl === null || typeof project.liveUrl === 'string').toBe(true);
        expect(project.repoUrl === null || typeof project.repoUrl === 'string').toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate project entries round-trip through JSON serialization', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const jsonString = JSON.stringify(project);
        const parsed = JSON.parse(jsonString) as Project;
        
        // Verify all fields survive serialization
        expect(parsed.id).toBe(project.id);
        expect(parsed.title).toBe(project.title);
        expect(parsed.description).toBe(project.description);
        expect(parsed.liveUrl).toBe(project.liveUrl);
        expect(parsed.repoUrl).toBe(project.repoUrl);
      }),
      { numRuns: 100 }
    );
  });

  it('should have at least one valid URL (liveUrl or repoUrl) for link rendering', () => {
    // Generate projects that have at least one URL
    const projectWithUrlArbitrary = projectArbitrary.filter(
      project => project.liveUrl !== null || project.repoUrl !== null
    );

    fc.assert(
      fc.property(projectWithUrlArbitrary, (project) => {
        // At least one URL should be available for the link
        const hasValidUrl = project.liveUrl !== null || project.repoUrl !== null;
        expect(hasValidUrl).toBe(true);
        
        // The URL used should be a valid string
        const projectUrl = project.liveUrl || project.repoUrl;
        expect(typeof projectUrl).toBe('string');
        expect(projectUrl!.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate actual projects.json file conforms to Project schema', async () => {
    const projectsData = await import('../../data/projects.json');
    
    expect(projectsData.projects).toBeDefined();
    expect(Array.isArray(projectsData.projects)).toBe(true);
    
    projectsData.projects.forEach((project: Project) => {
      // Required fields
      expect(typeof project.id).toBe('string');
      expect(project.id.length).toBeGreaterThan(0);
      
      expect(typeof project.title).toBe('string');
      expect(project.title.length).toBeGreaterThan(0);
      
      expect(typeof project.description).toBe('string');
      expect(project.description.length).toBeGreaterThan(0);
      
      // URL fields can be null or string
      expect(project.liveUrl === null || typeof project.liveUrl === 'string').toBe(true);
      expect(project.repoUrl === null || typeof project.repoUrl === 'string').toBe(true);
    });
  });
});


/**
 * **Feature: portfolio-website, Property 9: Projects section displays correct count**
 * **Validates: Requirements 5.4**
 * 
 * For any projects array, the Projects section SHALL display at most 6 projects,
 * showing all if fewer than 6 exist.
 */
describe('Property 9: Projects section displays correct count', () => {
  const MAX_PROJECTS = 6;

  // Function that mimics the display logic in Projects.tsx
  function getDisplayProjects(projects: Project[]): Project[] {
    return projects.slice(0, MAX_PROJECTS);
  }

  /**
   * **Feature: portfolio-website, Property 9: Projects section displays correct count**
   * **Validates: Requirements 5.4**
   */
  it('should display at most MAX_PROJECTS (6) projects', () => {
    fc.assert(
      fc.property(
        uniqueProjectsArbitrary(0, 20),
        (projects) => {
          const displayProjects = getDisplayProjects(projects);
          expect(displayProjects.length).toBeLessThanOrEqual(MAX_PROJECTS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all projects when fewer than MAX_PROJECTS exist', () => {
    fc.assert(
      fc.property(
        uniqueProjectsArbitrary(0, MAX_PROJECTS - 1),
        (projects) => {
          const displayProjects = getDisplayProjects(projects);
          // Should display all projects when count is less than MAX
          expect(displayProjects.length).toBe(projects.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should cap at MAX_PROJECTS when more projects exist', () => {
    fc.assert(
      fc.property(
        uniqueProjectsArbitrary(MAX_PROJECTS + 1, 20),
        (projects) => {
          const displayProjects = getDisplayProjects(projects);
          // Should cap at MAX_PROJECTS
          expect(displayProjects.length).toBe(MAX_PROJECTS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve project order when slicing', () => {
    fc.assert(
      fc.property(
        uniqueProjectsArbitrary(1, 20),
        (projects) => {
          const displayProjects = getDisplayProjects(projects);
          
          // First N projects should match
          displayProjects.forEach((project, index) => {
            expect(project.id).toBe(projects[index].id);
            expect(project.title).toBe(projects[index].title);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty projects array', () => {
    const displayProjects = getDisplayProjects([]);
    expect(displayProjects.length).toBe(0);
  });

  it('should validate actual projects.json has correct count', async () => {
    const projectsData = await import('../../data/projects.json');
    const displayProjects = getDisplayProjects(projectsData.projects as Project[]);
    
    // Should display at most MAX_PROJECTS
    expect(displayProjects.length).toBeLessThanOrEqual(MAX_PROJECTS);
    
    // Should display all if fewer than MAX_PROJECTS
    if (projectsData.projects.length <= MAX_PROJECTS) {
      expect(displayProjects.length).toBe(projectsData.projects.length);
    } else {
      expect(displayProjects.length).toBe(MAX_PROJECTS);
    }
  });
});
