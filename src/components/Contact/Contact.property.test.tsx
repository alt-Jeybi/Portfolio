import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { Contact } from './Contact';

/**
 * **Feature: portfolio-website, Property 14: Contact buttons have correct action protocols**
 * **Validates: Requirements 9.3, 9.4**
 *
 * For any valid contact data with email, phone, and messenger URL, the Contact component
 * SHALL render buttons with href attributes using "mailto:", "tel:", and "https://" protocols respectively.
 */

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Arbitrary for generating valid email addresses
const emailArbitrary = fc.emailAddress();

// Arbitrary for generating valid phone numbers (simple format)
const phoneArbitrary = fc.array(
  fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '+', ' '),
  { minLength: 7, maxLength: 20 }
).map((chars) => chars.join(''))
  .filter((phone) => /\d{3,}/.test(phone)); // Must have at least 3 digits

// Arbitrary for generating valid messenger URLs (must start with https://)
const messengerUrlArbitrary = fc.webUrl({ validSchemes: ['https'] });

// Combined arbitrary for contact data
const contactDataArbitrary = fc.record({
  email: emailArbitrary,
  phone: phoneArbitrary,
  messengerUrl: messengerUrlArbitrary,
});

describe('Property 14: Contact buttons have correct action protocols', () => {
  /**
   * **Feature: portfolio-website, Property 14: Contact buttons have correct action protocols**
   * **Validates: Requirements 9.3, 9.4**
   */
  it('should render email button with mailto: protocol', () => {
    fc.assert(
      fc.property(contactDataArbitrary, ({ email, phone, messengerUrl }) => {
        cleanup();
        render(<Contact email={email} phone={phone} messengerUrl={messengerUrl} />);

        const emailButton = screen.getByTestId('contact-email');
        expect(emailButton).toHaveAttribute('href', `mailto:${email}`);
      }),
      { numRuns: 100 }
    );
  });

  it('should render phone button with tel: protocol', () => {
    fc.assert(
      fc.property(contactDataArbitrary, ({ email, phone, messengerUrl }) => {
        cleanup();
        render(<Contact email={email} phone={phone} messengerUrl={messengerUrl} />);

        const phoneButton = screen.getByTestId('contact-phone');
        expect(phoneButton).toHaveAttribute('href', `tel:${phone}`);
      }),
      { numRuns: 100 }
    );
  });

  it('should render messenger button with https:// protocol', () => {
    fc.assert(
      fc.property(contactDataArbitrary, ({ email, phone, messengerUrl }) => {
        cleanup();
        render(<Contact email={email} phone={phone} messengerUrl={messengerUrl} />);

        const messengerButton = screen.getByTestId('contact-messenger');
        const href = messengerButton.getAttribute('href');
        expect(href).toBe(messengerUrl);
        expect(href?.startsWith('https://')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should render messenger button with target="_blank" for external link', () => {
    fc.assert(
      fc.property(contactDataArbitrary, ({ email, phone, messengerUrl }) => {
        cleanup();
        render(<Contact email={email} phone={phone} messengerUrl={messengerUrl} />);

        const messengerButton = screen.getByTestId('contact-messenger');
        expect(messengerButton).toHaveAttribute('target', '_blank');
        expect(messengerButton).toHaveAttribute('rel', 'noopener noreferrer');
      }),
      { numRuns: 100 }
    );
  });

  it('should validate actual profile.json contact data conforms to expected protocols', async () => {
    const profileData = await import('../../data/profile.json');

    // Email must be a valid email format
    expect(typeof profileData.email).toBe('string');
    expect(profileData.email.length).toBeGreaterThan(0);
    expect(profileData.email).toContain('@');

    // Phone must be a non-empty string
    expect(typeof profileData.phone).toBe('string');
    expect(profileData.phone.length).toBeGreaterThan(0);

    // Messenger URL must start with https://
    expect(typeof profileData.messengerUrl).toBe('string');
    expect(profileData.messengerUrl.startsWith('https://')).toBe(true);
  });
});
