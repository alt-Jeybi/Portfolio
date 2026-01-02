import { Card, CardHeader } from '../Card';
import galleryData from '../../data/gallery.json';
import type { GalleryImage } from '../../types';
import styles from './Gallery.module.css';

const MAX_IMAGES = 8;

// Image icon SVG component
function ImageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

// Limit display to 8 images maximum
const displayImages = (galleryData.images as GalleryImage[]).slice(0, MAX_IMAGES);

interface GalleryImageItemProps {
  image: GalleryImage;
}

function GalleryImageItem({ image }: GalleryImageItemProps) {
  return (
    <div className={styles.imageWrapper} data-testid="gallery-image-wrapper">
      <img
        src={image.src}
        alt={image.alt}
        className={styles.galleryImage}
        data-testid="gallery-image"
        loading="lazy"
      />
    </div>
  );
}

export function Gallery() {
  return (
    <Card className={styles.galleryCard}>
      <CardHeader icon={<ImageIcon />} title="Gallery" />
      <div className={styles.galleryContainer} data-testid="gallery-container">
        {displayImages.map((image) => (
          <GalleryImageItem key={image.id} image={image} />
        ))}
      </div>
    </Card>
  );
}

export default Gallery;
