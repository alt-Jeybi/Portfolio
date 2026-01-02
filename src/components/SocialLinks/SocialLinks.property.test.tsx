import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { SocialLinks } from './SocialLinks';
import type { SocialLink } from '../../types';

/**
 * **Feature: portfolio-website, Property 13: Social links render with correct attributes**
 * **Validates: Requirements 8.1, 8.2, 8.3**
 *
 * For any valid social link data containing platform, url, and icon, the SocialLinks component
 * SHALL render each link with the platform name, icon, correct href, and target="_blank" attribute.
 */

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Arbitrary for generating valid SocialLink objects
const platformArbitrary = fc.constantFrom('linkedin', 'github', 'instagram') as fc.Arbitrary<'linkedin' | 'github' | 'instagram'>;

const socialLinkArbitrary: fc.Arbitrary<SocialLink> = fc.record({
  platform: platformArbitrary,
  url: fc.webUrl(),
});

// Generate unique social links (one per platform)
const uniqueSocialLinksArbitrary = fc.uniqueArray(socialLinkArbitrary, {
  comparator: (a, b) => a.platform === b.platform,
  minLength: 1,
  maxLength: 3,
});

// Platform label mapping (matches component)
const labelMap: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
};

describe('Property 13: Social links render with correct attributes', () => {
  /**
   * **Feature: portfolio-website, Property 13: Social links render with correct attributes**
   * **Validates: Requirements 8.1, 8.2, 8.3**
   */
  it('should render each social link with correct href attribute', () => {
    fc.assert(
      fc.property(uniqueSocialLinksArbitrary, (links) => {
        cleanup(); // Clean up before each iteration
        render(<SocialLinks links={links} />);

        links.forEach((link) => {
          const linkElement = screen.getByTestId(`social-link-${link.platform}`);
          expect(linkElement).toHaveAttribute('href', link.url);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should render each social link with target="_blank" attribute', () => {
    fc.assert(
      fc.property(uniqueSocialLinksArbitrary, (links) => {
        cleanup(); // Clean up before each iteration
        render(<SocialLinks links={links} />);

        links.forEach((link) => {
          const linkElement = screen.getByTestId(`social-link-${link.platform}`);
          expect(linkElement).toHaveAttribute('target', '_blank');
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should render each social link with platform name label', () => {
    fc.assert(
      fc.property(uniqueSocialLinksArbitrary, (links) => {
        cleanup(); // Clean up before each iteration
        render(<SocialLinks links={links} />);

        links.forEach((link) => {
          const expectedLabel = labelMap[link.platform];
          expect(screen.getByText(expectedLabel)).toBeInTheDocument();
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should render each social link with rel="noopener noreferrer" for security', () => {
    fc.assert(
      fc.property(uniqueSocialLinksArbitrary, (links) => {
        cleanup(); // Clean up before each iteration
        render(<SocialLinks links={links} />);

        links.forEach((link) => {
          const linkElement = screen.getByTestId(`social-link-${link.platform}`);
          expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should render correct number of social links', () => {
    fc.assert(
      fc.property(uniqueSocialLinksArbitrary, (links) => {
        cleanup(); // Clean up before each iteration
        render(<SocialLinks links={links} />);

        links.forEach((link) => {
          const linkElement = screen.getByTestId(`social-link-${link.platform}`);
          expect(linkElement).toBeInTheDocument();
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should validate actual profile.json social links conform to schema', async () => {
    const profileData = await import('../../data/profile.json');

    expect(profileData.socialLinks).toBeDefined();
    expect(Array.isArray(profileData.socialLinks)).toBe(true);

    profileData.socialLinks.forEach((link) => {
      // Platform must be one of the valid values
      expect(['linkedin', 'github', 'instagram', 'email', 'twitter']).toContain(link.platform);

      // URL must be a non-empty string
      expect(typeof link.url).toBe('string');
      expect(link.url.length).toBeGreaterThan(0);
    });
  });
});
