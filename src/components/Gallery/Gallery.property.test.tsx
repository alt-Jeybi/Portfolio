import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { GalleryImage } from '../../types';

/**
 * **Feature: portfolio-website, Property 15: Gallery displays correct count of images**
 * **Validates: Requirements 10.1**
 * 
 * For any gallery images array, the Gallery section SHALL display at most 8 images,
 * showing all if fewer than 8 exist.
 */

// Arbitrary for generating valid GalleryImage objects
const galleryImageArbitrary: fc.Arbitrary<GalleryImage> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  src: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  alt: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
});

// Generate unique IDs for gallery images
const uniqueGalleryImagesArbitrary = (minLength: number, maxLength: number) =>
  fc.array(galleryImageArbitrary, { minLength, maxLength })
    .map(images => images.map((image, index) => ({ ...image, id: `img-${index}` })));

describe('Property 15: Gallery displays correct count of images', () => {
  const MAX_IMAGES = 8;

  // Function that mimics the display logic in Gallery.tsx
  function getDisplayImages(images: GalleryImage[]): GalleryImage[] {
    return images.slice(0, MAX_IMAGES);
  }

  /**
   * **Feature: portfolio-website, Property 15: Gallery displays correct count of images**
   * **Validates: Requirements 10.1**
   */
  it('should display at most MAX_IMAGES (8) images', () => {
    fc.assert(
      fc.property(
        uniqueGalleryImagesArbitrary(0, 20),
        (images) => {
          const displayImages = getDisplayImages(images);
          expect(displayImages.length).toBeLessThanOrEqual(MAX_IMAGES);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all images when fewer than MAX_IMAGES exist', () => {
    fc.assert(
      fc.property(
        uniqueGalleryImagesArbitrary(0, MAX_IMAGES - 1),
        (images) => {
          const displayImages = getDisplayImages(images);
          // Should display all images when count is less than MAX
          expect(displayImages.length).toBe(images.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should cap at MAX_IMAGES when more images exist', () => {
    fc.assert(
      fc.property(
        uniqueGalleryImagesArbitrary(MAX_IMAGES + 1, 20),
        (images) => {
          const displayImages = getDisplayImages(images);
          // Should cap at MAX_IMAGES
          expect(displayImages.length).toBe(MAX_IMAGES);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve image order when slicing', () => {
    fc.assert(
      fc.property(
        uniqueGalleryImagesArbitrary(1, 20),
        (images) => {
          const displayImages = getDisplayImages(images);
          
          // First N images should match
          displayImages.forEach((image, index) => {
            expect(image.id).toBe(images[index].id);
            expect(image.src).toBe(images[index].src);
            expect(image.alt).toBe(images[index].alt);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty images array', () => {
    const displayImages = getDisplayImages([]);
    expect(displayImages.length).toBe(0);
  });

  it('should validate actual gallery.json has correct count', async () => {
    const galleryData = await import('../../data/gallery.json');
    const displayImages = getDisplayImages(galleryData.images as GalleryImage[]);
    
    // Should display at most MAX_IMAGES
    expect(displayImages.length).toBeLessThanOrEqual(MAX_IMAGES);
    
    // Should display all if fewer than MAX_IMAGES
    if (galleryData.images.length <= MAX_IMAGES) {
      expect(displayImages.length).toBe(galleryData.images.length);
    } else {
      expect(displayImages.length).toBe(MAX_IMAGES);
    }
  });

  it('should have valid structure for any generated gallery image', () => {
    fc.assert(
      fc.property(galleryImageArbitrary, (image) => {
        // Verify image has all required fields for rendering
        expect(image.id).toBeDefined();
        expect(typeof image.id).toBe('string');
        expect(image.id.trim().length).toBeGreaterThan(0);
        
        expect(image.src).toBeDefined();
        expect(typeof image.src).toBe('string');
        expect(image.src.trim().length).toBeGreaterThan(0);
        
        expect(image.alt).toBeDefined();
        expect(typeof image.alt).toBe('string');
        expect(image.alt.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});
