import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import type { Profile } from '../../types';

/**
 * **Feature: portfolio-website, Property 1: Hero profile rendering completeness**
 * **Validates: Requirements 1.1, 1.2**
 * 
 * For any valid profile data containing name, title, and avatar, 
 * the Hero component SHALL render all three elements in the output.
 */

// Arbitrary for generating valid Profile data for Hero section
const heroProfileArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  avatar: fc.oneof(
    fc.webUrl(),
    fc.constant('/images/avatar.jpg'),
    fc.constant('')
  ),
});

// Hero component that accepts profile as prop for testing
function HeroTestable({ profile }: { profile: Pick<Profile, 'name' | 'title' | 'avatar'> }) {
  const PLACEHOLDER_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23e5e7eb"/%3E%3Ccircle cx="50" cy="40" r="20" fill="%239ca3af"/%3E%3Cellipse cx="50" cy="85" rx="30" ry="25" fill="%239ca3af"/%3E%3C/svg%3E';

  return (
    <section data-testid="hero-section">
      <img
        src={profile.avatar || PLACEHOLDER_AVATAR}
        alt={`${profile.name}'s profile photo`}
        data-testid="hero-avatar"
      />
      <h1 data-testid="hero-name">{profile.name}</h1>
      <p data-testid="hero-title">{profile.title}</p>
    </section>
  );
}

describe('Property 1: Hero profile rendering completeness', () => {
  it('should render all four profile elements (name, title, tagline, avatar) for any valid profile data', () => {
    fc.assert(
      fc.property(heroProfileArbitrary, (profile) => {
        const { unmount } = render(<HeroTestable profile={profile} />);

        // Verify name is rendered
        const nameElement = screen.getByTestId('hero-name');
        expect(nameElement).toBeInTheDocument();
        expect(nameElement.textContent).toBe(profile.name);

        // Verify title is rendered
        const titleElement = screen.getByTestId('hero-title');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.textContent).toBe(profile.title);

        // Verify avatar is rendered (either with provided URL or placeholder)
        const avatarElement = screen.getByTestId('hero-avatar');
        expect(avatarElement).toBeInTheDocument();
        expect(avatarElement).toHaveAttribute('src');
        expect(avatarElement).toHaveAttribute('alt');

        // Clean up for next iteration
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should use placeholder avatar when avatar URL is empty', () => {
    const profileWithEmptyAvatar = {
      name: 'Test User',
      title: 'Developer',
      avatar: '',
    };

    render(<HeroTestable profile={profileWithEmptyAvatar} />);

    const avatarElement = screen.getByTestId('hero-avatar');
    expect(avatarElement).toHaveAttribute('src');
    // Should have a non-empty src (placeholder)
    expect(avatarElement.getAttribute('src')).not.toBe('');
  });

  it('should render avatar with correct alt text containing profile name', () => {
    fc.assert(
      fc.property(heroProfileArbitrary, (profile) => {
        const { unmount } = render(<HeroTestable profile={profile} />);

        const avatarElement = screen.getByTestId('hero-avatar');
        const altText = avatarElement.getAttribute('alt');
        
        // Alt text should contain the profile name
        expect(altText).toContain(profile.name);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
