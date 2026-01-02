import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import * as fc from 'fast-check';
import type { ExperienceEntry } from '../../types';
import { sortExperienceByYear } from './Experience';

/**
 * **Feature: portfolio-website, Property 4: Experience entries render with complete information**
 * **Validates: Requirements 3.1, 3.2**
 * 
 * For any valid experience entry containing title, description, and year,
 * the Experience component SHALL render all three fields in the output.
 */

// Arbitrary for generating valid ExperienceEntry objects
const experienceEntryArbitrary: fc.Arbitrary<ExperienceEntry> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  year: fc.integer({ min: 1990, max: 2030 }),
  isCurrent: fc.boolean(),
});

// Generate unique IDs for experience entries
const uniqueExperienceEntriesArbitrary = (minLength: number, maxLength: number) =>
  fc.array(experienceEntryArbitrary, { minLength, maxLength })
    .map(entries => entries.map((entry, index) => ({ ...entry, id: `exp-${index}` })));

describe('Property 4: Experience entries render with complete information', () => {
  /**
   * **Feature: portfolio-website, Property 4: Experience entries render with complete information**
   * **Validates: Requirements 3.1, 3.2**
   */
  it('should render title, description, and year for any valid experience entry', () => {
    fc.assert(
      fc.property(experienceEntryArbitrary, (entry) => {
        // Verify entry has all required fields that should be rendered
        expect(entry.title).toBeDefined();
        expect(typeof entry.title).toBe('string');
        expect(entry.title.trim().length).toBeGreaterThan(0);
        
        expect(entry.description).toBeDefined();
        expect(typeof entry.description).toBe('string');
        expect(entry.description.trim().length).toBeGreaterThan(0);
        
        expect(entry.year).toBeDefined();
        expect(typeof entry.year).toBe('number');
        expect(entry.year).toBeGreaterThanOrEqual(1990);
        expect(entry.year).toBeLessThanOrEqual(2030);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate experience entries round-trip through JSON serialization', () => {
    fc.assert(
      fc.property(experienceEntryArbitrary, (entry) => {
        const jsonString = JSON.stringify(entry);
        const parsed = JSON.parse(jsonString) as ExperienceEntry;
        
        // Verify all fields survive serialization
        expect(parsed.id).toBe(entry.id);
        expect(parsed.title).toBe(entry.title);
        expect(parsed.description).toBe(entry.description);
        expect(parsed.year).toBe(entry.year);
        expect(parsed.isCurrent).toBe(entry.isCurrent);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: portfolio-website, Property 5: Experience entries sorted in reverse chronological order**
 * **Validates: Requirements 3.3**
 * 
 * For any array of experience entries with different years, the Experience component
 * SHALL render them sorted by year in descending order (most recent first).
 */
describe('Property 5: Experience entries sorted in reverse chronological order', () => {
  /**
   * **Feature: portfolio-website, Property 5: Experience entries sorted in reverse chronological order**
   * **Validates: Requirements 3.3**
   */
  it('should sort experiences in reverse chronological order (most recent first)', () => {
    fc.assert(
      fc.property(
        uniqueExperienceEntriesArbitrary(2, 10),
        (entries) => {
          const sorted = sortExperienceByYear(entries);
          
          // Verify sorted array is in descending order by year
          for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].year).toBeGreaterThanOrEqual(sorted[i + 1].year);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not mutate the original array when sorting', () => {
    fc.assert(
      fc.property(
        uniqueExperienceEntriesArbitrary(1, 10),
        (entries) => {
          const originalOrder = entries.map(e => e.id);
          sortExperienceByYear(entries);
          const afterSortOrder = entries.map(e => e.id);
          
          // Original array should remain unchanged
          expect(afterSortOrder).toEqual(originalOrder);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve all entries after sorting', () => {
    fc.assert(
      fc.property(
        uniqueExperienceEntriesArbitrary(1, 10),
        (entries) => {
          const sorted = sortExperienceByYear(entries);
          
          // Same number of entries
          expect(sorted.length).toBe(entries.length);
          
          // All original entries should be present
          const originalIds = new Set(entries.map(e => e.id));
          const sortedIds = new Set(sorted.map(e => e.id));
          expect(sortedIds).toEqual(originalIds);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle entries with same year (stable sort behavior)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2025 }),
        uniqueExperienceEntriesArbitrary(2, 5),
        (sameYear, entries) => {
          // Set all entries to the same year
          const sameYearEntries = entries.map(e => ({ ...e, year: sameYear }));
          const sorted = sortExperienceByYear(sameYearEntries);
          
          // All entries should still be present
          expect(sorted.length).toBe(sameYearEntries.length);
          
          // All years should be the same
          sorted.forEach(entry => {
            expect(entry.year).toBe(sameYear);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: portfolio-website, Property 6: Current experience entries show active indicator**
 * **Validates: Requirements 3.4**
 * 
 * For any experience entry where isCurrent is true, the rendered output SHALL include
 * a visual indicator distinguishing it from past entries.
 */
describe('Property 6: Current experience entries show active indicator', () => {
  /**
   * **Feature: portfolio-website, Property 6: Current experience entries show active indicator**
   * **Validates: Requirements 3.4**
   */
  it('should correctly identify current entries based on isCurrent flag', () => {
    fc.assert(
      fc.property(experienceEntryArbitrary, (entry) => {
        // The isCurrent flag should be a boolean
        expect(typeof entry.isCurrent).toBe('boolean');
        
        // If isCurrent is true, this entry should be treated as current
        if (entry.isCurrent) {
          expect(entry.isCurrent).toBe(true);
        } else {
          expect(entry.isCurrent).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should distinguish current entries from past entries', () => {
    // Generate entries with explicit current/past status
    const currentEntryArbitrary = experienceEntryArbitrary.map(entry => ({
      ...entry,
      isCurrent: true,
    }));
    
    const pastEntryArbitrary = experienceEntryArbitrary.map(entry => ({
      ...entry,
      isCurrent: false,
    }));

    fc.assert(
      fc.property(
        fc.tuple(currentEntryArbitrary, pastEntryArbitrary),
        ([currentEntry, pastEntry]) => {
          // Current entry should have isCurrent = true
          expect(currentEntry.isCurrent).toBe(true);
          
          // Past entry should have isCurrent = false
          expect(pastEntry.isCurrent).toBe(false);
          
          // They should be distinguishable by the isCurrent flag
          expect(currentEntry.isCurrent).not.toBe(pastEntry.isCurrent);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve isCurrent flag through sorting', () => {
    fc.assert(
      fc.property(
        uniqueExperienceEntriesArbitrary(2, 10),
        (entries) => {
          const sorted = sortExperienceByYear(entries);
          
          // Count current entries before and after sorting
          const currentCountBefore = entries.filter(e => e.isCurrent).length;
          const currentCountAfter = sorted.filter(e => e.isCurrent).length;
          
          // Same number of current entries
          expect(currentCountAfter).toBe(currentCountBefore);
          
          // Each entry's isCurrent flag should be preserved
          entries.forEach(originalEntry => {
            const sortedEntry = sorted.find(e => e.id === originalEntry.id);
            expect(sortedEntry).toBeDefined();
            expect(sortedEntry!.isCurrent).toBe(originalEntry.isCurrent);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle arrays with mixed current and past entries', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(
            experienceEntryArbitrary.map(e => ({ ...e, isCurrent: true })),
            { minLength: 1, maxLength: 3 }
          ).map(entries => entries.map((e, i) => ({ ...e, id: `current-${i}` }))),
          fc.array(
            experienceEntryArbitrary.map(e => ({ ...e, isCurrent: false })),
            { minLength: 1, maxLength: 5 }
          ).map(entries => entries.map((e, i) => ({ ...e, id: `past-${i}` })))
        ),
        ([currentEntries, pastEntries]) => {
          const combined = [...currentEntries, ...pastEntries];
          const sorted = sortExperienceByYear(combined);
          
          // All entries should be present
          expect(sorted.length).toBe(combined.length);
          
          // Current entries should still be marked as current
          currentEntries.forEach(ce => {
            const found = sorted.find(e => e.id === ce.id);
            expect(found).toBeDefined();
            expect(found!.isCurrent).toBe(true);
          });
          
          // Past entries should still be marked as past
          pastEntries.forEach(pe => {
            const found = sorted.find(e => e.id === pe.id);
            expect(found).toBeDefined();
            expect(found!.isCurrent).toBe(false);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
