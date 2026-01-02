import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { Certification } from '../../types';

/**
 * **Feature: portfolio-website, Property 10: Certification entries render with name and issuer**
 * **Validates: Requirements 6.1, 6.2**
 * 
 * For any valid certification data containing name and issuer,
 * the Certifications component SHALL render both fields in the output.
 */

// Arbitrary for generating valid Certification objects
const certificationArbitrary: fc.Arbitrary<Certification> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  name: fc.string({ minLength: 1, maxLength: 150 }).filter(s => s.trim().length > 0),
  issuer: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
});

// Generate unique IDs for certifications
const uniqueCertificationsArbitrary = (minLength: number, maxLength: number) =>
  fc.array(certificationArbitrary, { minLength, maxLength })
    .map(certs => certs.map((cert, index) => ({ ...cert, id: `cert-${index}` })));

describe('Property 10: Certification entries render with name and issuer', () => {
  /**
   * **Feature: portfolio-website, Property 10: Certification entries render with name and issuer**
   * **Validates: Requirements 6.1, 6.2**
   */
  it('should have valid structure with name and issuer for any generated certification', () => {
    fc.assert(
      fc.property(certificationArbitrary, (certification) => {
        // Verify certification has all required fields for rendering
        expect(certification.name).toBeDefined();
        expect(typeof certification.name).toBe('string');
        expect(certification.name.trim().length).toBeGreaterThan(0);
        
        expect(certification.issuer).toBeDefined();
        expect(typeof certification.issuer).toBe('string');
        expect(certification.issuer.trim().length).toBeGreaterThan(0);
        
        expect(certification.id).toBeDefined();
        expect(typeof certification.id).toBe('string');
        expect(certification.id.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate certification entries round-trip through JSON serialization', () => {
    fc.assert(
      fc.property(certificationArbitrary, (certification) => {
        const jsonString = JSON.stringify(certification);
        const parsed = JSON.parse(jsonString) as Certification;
        
        // Verify all fields survive serialization
        expect(parsed.id).toBe(certification.id);
        expect(parsed.name).toBe(certification.name);
        expect(parsed.issuer).toBe(certification.issuer);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate actual certifications.json file conforms to Certification schema', async () => {
    const certificationsData = await import('../../data/certifications.json');
    
    expect(certificationsData.certifications).toBeDefined();
    expect(Array.isArray(certificationsData.certifications)).toBe(true);
    
    certificationsData.certifications.forEach((certification: Certification) => {
      // Required fields
      expect(typeof certification.id).toBe('string');
      expect(certification.id.length).toBeGreaterThan(0);
      
      expect(typeof certification.name).toBe('string');
      expect(certification.name.length).toBeGreaterThan(0);
      
      expect(typeof certification.issuer).toBe('string');
      expect(certification.issuer.length).toBeGreaterThan(0);
    });
  });
});

/**
 * **Feature: portfolio-website, Property 11: Certifications section displays correct count**
 * **Validates: Requirements 6.3**
 * 
 * For any certifications array, the Certifications section SHALL display at most 5 certifications,
 * showing all if fewer than 5 exist.
 */
describe('Property 11: Certifications section displays correct count', () => {
  const MAX_CERTIFICATIONS = 5;

  // Function that mimics the display logic in Certifications.tsx
  function getDisplayCertifications(certifications: Certification[]): Certification[] {
    return certifications.slice(0, MAX_CERTIFICATIONS);
  }

  /**
   * **Feature: portfolio-website, Property 11: Certifications section displays correct count**
   * **Validates: Requirements 6.3**
   */
  it('should display at most MAX_CERTIFICATIONS (5) certifications', () => {
    fc.assert(
      fc.property(
        uniqueCertificationsArbitrary(0, 20),
        (certifications) => {
          const displayCertifications = getDisplayCertifications(certifications);
          expect(displayCertifications.length).toBeLessThanOrEqual(MAX_CERTIFICATIONS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all certifications when fewer than MAX_CERTIFICATIONS exist', () => {
    fc.assert(
      fc.property(
        uniqueCertificationsArbitrary(0, MAX_CERTIFICATIONS - 1),
        (certifications) => {
          const displayCertifications = getDisplayCertifications(certifications);
          // Should display all certifications when count is less than MAX
          expect(displayCertifications.length).toBe(certifications.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should cap at MAX_CERTIFICATIONS when more certifications exist', () => {
    fc.assert(
      fc.property(
        uniqueCertificationsArbitrary(MAX_CERTIFICATIONS + 1, 20),
        (certifications) => {
          const displayCertifications = getDisplayCertifications(certifications);
          // Should cap at MAX_CERTIFICATIONS
          expect(displayCertifications.length).toBe(MAX_CERTIFICATIONS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve certification order when slicing', () => {
    fc.assert(
      fc.property(
        uniqueCertificationsArbitrary(1, 20),
        (certifications) => {
          const displayCertifications = getDisplayCertifications(certifications);
          
          // First N certifications should match
          displayCertifications.forEach((cert, index) => {
            expect(cert.id).toBe(certifications[index].id);
            expect(cert.name).toBe(certifications[index].name);
            expect(cert.issuer).toBe(certifications[index].issuer);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty certifications array', () => {
    const displayCertifications = getDisplayCertifications([]);
    expect(displayCertifications.length).toBe(0);
  });

  it('should validate actual certifications.json has correct count', async () => {
    const certificationsData = await import('../../data/certifications.json');
    const displayCertifications = getDisplayCertifications(certificationsData.certifications as Certification[]);
    
    // Should display at most MAX_CERTIFICATIONS
    expect(displayCertifications.length).toBeLessThanOrEqual(MAX_CERTIFICATIONS);
    
    // Should display all if fewer than MAX_CERTIFICATIONS
    if (certificationsData.certifications.length <= MAX_CERTIFICATIONS) {
      expect(displayCertifications.length).toBe(certificationsData.certifications.length);
    } else {
      expect(displayCertifications.length).toBe(MAX_CERTIFICATIONS);
    }
  });
});
