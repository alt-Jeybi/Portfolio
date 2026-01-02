import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import type { Profile } from '../../types';
import { ProfileHeader } from './ProfileHeader';

/**
 * **Feature: portfolio-website, Property 1: Profile header rendering completeness**
 * **Validates: Requirements 1.1**
 * 
 * For any valid profile data containing name, verified status, location, title, and avatar,
 * the ProfileHeader component SHALL render all five elements in the output.
 */

// Arbitrary for generating valid Profile objects for ProfileHeader testing
const profileArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  verified: fc.boolean(),
  location: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  avatar: fc.oneof(
    fc.webUrl(),
    fc.constant('/images/avatar.jpg'),
    fc.constant('')
  ),
  resumeUrl: fc.string({ minLength: 1, maxLength: 200 }),
  email: fc.emailAddress(),
  phone: fc.string({ minLength: 1, maxLength: 20 }),
  messengerUrl: fc.webUrl(),
  bio: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 3 }),
  experience: fc.array(
    fc.record({
      id: fc.string({ minLength: 1 }),
      title: fc.string({ minLength: 1 }),
      description: fc.string({ minLength: 1 }),
      year: fc.integer({ min: 1990, max: 2030 }),
      isCurrent: fc.boolean(),
    }),
    { minLength: 0, maxLength: 5 }
  ),
  goals: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 3 }),
  socialLinks: fc.array(
    fc.record({
      platform: fc.constantFrom('linkedin', 'github', 'instagram') as fc.Arbitrary<'linkedin' | 'github' | 'instagram'>,
      url: fc.webUrl(),
    }),
    { minLength: 0, maxLength: 3 }
  ),
});

describe('Property 1: Profile header rendering completeness', () => {
  it('should render name, verified status, location, title, and avatar for any valid profile', () => {
    fc.assert(
      fc.property(profileArbitrary, (profile) => {
        const { unmount } = render(<ProfileHeader profileOverride={profile as Profile} />);
        
        // Verify name is rendered
        const nameElement = screen.getByTestId('profile-name');
        expect(nameElement).toBeInTheDocument();
        expect(nameElement.textContent).toBe(profile.name);
        
        // Verify location is rendered
        const locationElement = screen.getByTestId('profile-location');
        expect(locationElement).toBeInTheDocument();
        expect(locationElement.textContent).toContain(profile.location);
        
        // Verify title is rendered
        const titleElement = screen.getByTestId('profile-title');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.textContent).toBe(profile.title);
        
        // Verify avatar is rendered
        const avatarElement = screen.getByTestId('profile-avatar');
        expect(avatarElement).toBeInTheDocument();
        expect(avatarElement).toHaveAttribute('src');
        
        // Verify verified badge is rendered when verified is true
        if (profile.verified) {
          const verifiedBadge = screen.getByTestId('profile-verified');
          expect(verifiedBadge).toBeInTheDocument();
        }
        
        // Cleanup for next iteration
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should render all five required elements for any profile with verified=true', () => {
    const verifiedProfileArbitrary = profileArbitrary.map(profile => ({
      ...profile,
      verified: true,
    }));

    fc.assert(
      fc.property(verifiedProfileArbitrary, (profile) => {
        const { unmount } = render(<ProfileHeader profileOverride={profile as Profile} />);
        
        // All five elements must be present
        expect(screen.getByTestId('profile-name')).toBeInTheDocument();
        expect(screen.getByTestId('profile-verified')).toBeInTheDocument();
        expect(screen.getByTestId('profile-location')).toBeInTheDocument();
        expect(screen.getByTestId('profile-title')).toBeInTheDocument();
        expect(screen.getByTestId('profile-avatar')).toBeInTheDocument();
        
        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: portfolio-website, Property 2: Email button contains correct mailto link**
 * **Validates: Requirements 1.4**
 * 
 * For any valid profile with an email address, the "Send Email" button SHALL have 
 * an href attribute starting with "mailto:" followed by the email address.
 */
describe('Property 2: Email button contains correct mailto link', () => {
  it('should have mailto: href with correct email for any valid profile', () => {
    fc.assert(
      fc.property(profileArbitrary, (profile) => {
        const { unmount } = render(<ProfileHeader profileOverride={profile as Profile} />);
        
        // Find the email button
        const emailButton = screen.getByTestId('profile-email-btn');
        expect(emailButton).toBeInTheDocument();
        
        // Verify href starts with mailto: and contains the email
        const href = emailButton.getAttribute('href');
        expect(href).toBe(`mailto:${profile.email}`);
        expect(href).toMatch(/^mailto:/);
        
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should construct valid mailto link for any email address', () => {
    fc.assert(
      fc.property(fc.emailAddress(), (email) => {
        const profile: Profile = {
          name: 'Test User',
          verified: true,
          location: 'Test City',
          title: 'Test Title',
          avatar: '/test.jpg',
          resumeUrl: '/resume.pdf',
          email: email,
          phone: '123-456-7890',
          messengerUrl: 'https://m.me/test',
          bio: ['Test bio'],
          experience: [],
          goals: [],
          socialLinks: [],
        };
        
        const { unmount } = render(<ProfileHeader profileOverride={profile} />);
        
        const emailButton = screen.getByTestId('profile-email-btn');
        const href = emailButton.getAttribute('href');
        
        // Verify the mailto link format
        expect(href).toBe(`mailto:${email}`);
        
        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
