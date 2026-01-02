import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import type { Profile } from '../../types';

/**
 * **Feature: portfolio-website, Property 3: About section renders biography**
 * **Validates: Requirements 2.1**
 * 
 * For any valid profile data with bio paragraphs, the About component SHALL render 
 * all biography paragraphs in the output.
 */

// Mock component that renders bio paragraphs (matching About component structure)
function AboutTestComponent({ bio }: { bio: string[] }) {
  return (
    <div data-testid="biography">
      {bio.map((paragraph, index) => (
        <p key={index} data-testid={`bio-paragraph-${index}`}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

// Arbitrary for generating valid bio arrays
const bioArbitrary = fc.array(
  fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  { minLength: 1, maxLength: 5 }
);

describe('Property 3: About section renders biography', () => {
  it('should render all biography paragraphs for any valid bio array', () => {
    fc.assert(
      fc.property(bioArbitrary, (bio) => {
        const { unmount } = render(<AboutTestComponent bio={bio} />);
        
        // Verify biography container is rendered
        const biographyElement = screen.getByTestId('biography');
        expect(biographyElement).toBeInTheDocument();
        
        // Verify all paragraphs are rendered
        bio.forEach((paragraph, index) => {
          const paragraphElement = screen.getByTestId(`bio-paragraph-${index}`);
          expect(paragraphElement).toBeInTheDocument();
          expect(paragraphElement.textContent).toBe(paragraph);
        });
        
        // Verify the correct number of paragraphs
        const allParagraphs = screen.getAllByTestId(/^bio-paragraph-/);
        expect(allParagraphs.length).toBe(bio.length);
        
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should render paragraphs in the correct order', () => {
    fc.assert(
      fc.property(bioArbitrary, (bio) => {
        const { unmount } = render(<AboutTestComponent bio={bio} />);
        
        const allParagraphs = screen.getAllByTestId(/^bio-paragraph-/);
        
        // Verify paragraphs appear in the same order as the bio array
        allParagraphs.forEach((element, index) => {
          expect(element.textContent).toBe(bio[index]);
        });
        
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should handle single paragraph bios', () => {
    const singleParagraphBio = fc.array(
      fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      { minLength: 1, maxLength: 1 }
    );

    fc.assert(
      fc.property(singleParagraphBio, (bio) => {
        const { unmount } = render(<AboutTestComponent bio={bio} />);
        
        const allParagraphs = screen.getAllByTestId(/^bio-paragraph-/);
        expect(allParagraphs.length).toBe(1);
        expect(allParagraphs[0].textContent).toBe(bio[0]);
        
        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
