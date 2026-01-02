import { ProfileHeader } from '../ProfileHeader';
import { About } from '../About';
import { Experience } from '../Experience';
import { TechStack } from '../TechStack';
import { Projects } from '../Projects';
import { Certifications } from '../Certifications';
import { Goals } from '../Goals';
import { SocialLinks } from '../SocialLinks';
import { Contact } from '../Contact';
import { Gallery } from '../Gallery';
import styles from './BentoGrid.module.css';

export function BentoGrid() {
  return (
    <div className={styles.bentoGrid}>
      {/* Profile Header - Full Width */}
      <div className={styles.profileHeaderArea}>
        <ProfileHeader />
      </div>

      {/* About and Experience - Side by Side */}
      <div className={styles.aboutArea}>
        <About />
      </div>
      <div className={styles.experienceArea}>
        <Experience />
      </div>

      {/* TechStack and Projects - Side by Side */}
      <div className={styles.techStackArea}>
        <TechStack />
      </div>
      <div className={styles.projectsArea}>
        <Projects />
      </div>

      {/* Certifications */}
      <div className={styles.certificationsArea}>
        <Certifications />
      </div>

      {/* Goals, SocialLinks, Contact - Row */}
      <div className={styles.goalsArea}>
        <Goals />
      </div>
      <div className={styles.socialLinksArea}>
        <SocialLinks />
      </div>
      <div className={styles.contactArea}>
        <Contact />
      </div>

      {/* Gallery - Full Width */}
      <div className={styles.galleryArea}>
        <Gallery />
      </div>
    </div>
  );
}

export default BentoGrid;
