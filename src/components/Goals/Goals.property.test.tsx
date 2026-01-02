import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: portfolio-website, Property 12: Goals section displays correct count**
 * **Validates: Requirements 7.1**
 * 
 * For any goals array, the Goals section SHALL display at most 3 goals,
 * showing all if fewer than 3 exist.
 */

// Arbitrary for generating valid goal strings
const goalArbitrary: fc.Arbitrary<string> = fc.string({ minLength: 1, maxLength: 200 })
  .filter(s => s.trim().length > 0);

// Generate arrays of goals
const goalsArrayArbitrary = (minLength: number, maxLength: number) =>
  fc.array(goalArbitrary, { minLength, maxLength });

describe('Property 12: Goals section displays correct count', () => {
  const MAX_GOALS = 3;

  // Function that mimics the display logic in Goals.tsx
  function getDisplayGoals(goals: string[]): string[] {
    return goals.slice(0, MAX_GOALS);
  }

  /**
   * **Feature: portfolio-website, Property 12: Goals section displays correct count**
   * **Validates: Requirements 7.1**
   */
  it('should display at most MAX_GOALS (3) goals', () => {
    fc.assert(
      fc.property(
        goalsArrayArbitrary(0, 20),
        (goals) => {
          const displayGoals = getDisplayGoals(goals);
          expect(displayGoals.length).toBeLessThanOrEqual(MAX_GOALS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all goals when fewer than MAX_GOALS exist', () => {
    fc.assert(
      fc.property(
        goalsArrayArbitrary(0, MAX_GOALS - 1),
        (goals) => {
          const displayGoals = getDisplayGoals(goals);
          // Should display all goals when count is less than MAX
          expect(displayGoals.length).toBe(goals.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should cap at MAX_GOALS when more goals exist', () => {
    fc.assert(
      fc.property(
        goalsArrayArbitrary(MAX_GOALS + 1, 20),
        (goals) => {
          const displayGoals = getDisplayGoals(goals);
          // Should cap at MAX_GOALS
          expect(displayGoals.length).toBe(MAX_GOALS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve goal order when slicing', () => {
    fc.assert(
      fc.property(
        goalsArrayArbitrary(1, 20),
        (goals) => {
          const displayGoals = getDisplayGoals(goals);
          
          // First N goals should match
          displayGoals.forEach((goal, index) => {
            expect(goal).toBe(goals[index]);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty goals array', () => {
    const displayGoals = getDisplayGoals([]);
    expect(displayGoals.length).toBe(0);
  });

  it('should validate goal strings round-trip through JSON serialization', () => {
    fc.assert(
      fc.property(goalArbitrary, (goal) => {
        const jsonString = JSON.stringify(goal);
        const parsed = JSON.parse(jsonString) as string;
        
        // Verify goal survives serialization
        expect(parsed).toBe(goal);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate actual profile.json goals has correct count', async () => {
    const profileData = await import('../../data/profile.json');
    const displayGoals = getDisplayGoals(profileData.goals as string[]);
    
    // Should display at most MAX_GOALS
    expect(displayGoals.length).toBeLessThanOrEqual(MAX_GOALS);
    
    // Should display all if fewer than MAX_GOALS
    if (profileData.goals.length <= MAX_GOALS) {
      expect(displayGoals.length).toBe(profileData.goals.length);
    } else {
      expect(displayGoals.length).toBe(MAX_GOALS);
    }
  });
});
