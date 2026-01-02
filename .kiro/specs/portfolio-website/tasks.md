# Implementation Plan

- [x] 1. Set up data layer and TypeScript interfaces






  - [x] 1.1 Update TypeScript interfaces for new design

    - Update `src/types/index.ts` with Profile, ExperienceEntry, SkillCategory, Project, Certification, GalleryImage, SocialLink, ChatMessage interfaces
    - Export all types for use across components

    - _Requirements: 14.1, 14.2_
  - [x] 1.2 Create/update JSON data files

    - Update `src/data/profile.json` with name, verified, location, title, avatar, resumeUrl, email, phone, messengerUrl, bio, experience, goals, socialLinks
    - Update `src/data/skills.json` with categorized skills (Frontend, Backend, Tools & Frameworks, Foundational Skills)
    - Update `src/data/projects.json` with 4-6 recent projects
    - Create `src/data/certifications.json` with 3-5 certifications
    - Create `src/data/gallery.json` with 5-8 gallery images
    - _Requirements: 14.2, 14.4_
  - [x] 1.3 Write property test for JSON schema validity






    - **Property 18: JSON data files conform to schema**
    - **Validates: Requirements 14.2**

- [x] 2. Create base Card component and CSS variables


  - [x] 2.1 Update CSS variables for bento design
    - Update `src/styles/variables.css` with card border-radius (16px), shadows, background colors (#f5f5f5 page, white cards)
    - Add spacing variables for consistent card gaps

    - _Requirements: 12.1, 12.3_
  - [x] 2.2 Create reusable Card component


    - Build `src/components/Card/Card.tsx` with consistent styling
    - Create `Card.module.css` with rounded corners, shadow, white background
    - Support CardHeader sub-component with icon + title pattern
    - _Requirements: 12.1, 12.2, 14.1_

- [x] 3. Implement ProfileHeader component









  - [x] 3.1 Create ProfileHeader component

    - Build `src/components/ProfileHeader/ProfileHeader.tsx`
    - Display avatar, name with verification badge, location, title
    - Add "View Resume" button (opens PDF in new tab)
    - Add "Send Email" button (mailto: link)
    - Create `ProfileHeader.module.css` with horizontal layout
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 3.2 Write property tests for ProfileHeader






    - **Property 1: Profile header rendering completeness**
    - **Property 2: Email button contains correct mailto link**
    - **Validates: Requirements 1.1, 1.4**

- [x] 4. Implement About component







  - [x] 4.1 Create About card component




    - Build `src/components/About/About.tsx`
    - Display CardHeader with home icon and "About" title
    - Render biography paragraphs from profile data
    - Create `About.module.css` with typography styles
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 4.2 Write property test for About






    - **Property 3: About section renders biography**
    - **Validates: Requirements 2.1**

- [x] 5. Implement Experience Timeline component





  - [x] 5.1 Create Experience component with timeline

    - Build `src/components/Experience/Experience.tsx`
    - Display CardHeader with briefcase icon and "Experience" title
    - Render timeline entries with circular markers and connecting line
    - Show title, description, year for each entry
    - Highlight current entries with filled marker
    - Sort entries by year descending
    - Create `Experience.module.css` with timeline styling
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 5.2 Write property tests for Experience






    - **Property 4: Experience entries render with complete information**
    - **Property 5: Experience entries sorted in reverse chronological order**
    - **Property 6: Current experience entries show active indicator**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 6. Implement TechStack component






  - [x] 6.1 Create TechStack card component

    - Build `src/components/TechStack/TechStack.tsx`
    - Display CardHeader with code icon and "Tech Stack" title
    - Render skill categories with category name headings
    - Display skills as pill-shaped tags (dark background, light text)
    - Create `TechStack.module.css` with tag styling
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 6.2 Write property test for TechStack






    - **Property 7: Tech stack renders all categories with their skills**
    - **Validates: Requirements 4.1, 4.3**

- [x] 7. Checkpoint - Ensure all tests pass








  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement Projects component






  - [x] 8.1 Create Projects card component

    - Build `src/components/Projects/Projects.tsx`
    - Display CardHeader with grid icon and "Recent Projects" title
    - Render project cards in 2-column grid
    - Show project name, description, and link button
    - Limit display to 6 projects maximum
    - Links open in new tab (target="_blank")
    - Update `Projects.module.css` with grid layout
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 8.2 Write property tests for Projects






    - **Property 8: Project cards display complete information with valid links**
    - **Property 9: Projects section displays correct count**
    - **Validates: Requirements 5.2, 5.3, 5.4**

- [x] 9. Implement Certifications component







  - [x] 9.1 Create Certifications card component





    - Build `src/components/Certifications/Certifications.tsx`
    - Display CardHeader with checkmark icon and "Recent Certifications" title
    - Render certification entries in list format
    - Show certification name and issuer for each entry
    - Limit display to 5 certifications maximum
    - Create `Certifications.module.css`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [x] 9.2 Write property tests for Certifications






    - **Property 10: Certification entries render with name and issuer**
    - **Property 11: Certifications section displays correct count**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 10. Implement Goals component






  - [x] 10.1 Create Goals card component

    - Build `src/components/Goals/Goals.tsx`
    - Display CardHeader with target icon and "Goals" title
    - Render goal statements in bordered containers with left accent
    - Limit display to 3 goals maximum
    - Create `Goals.module.css`
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 10.2 Write property test for Goals






    - **Property 12: Goals section displays correct count**
    - **Validates: Requirements 7.1**

- [x] 11. Implement SocialLinks component





  - [x] 11.1 Create SocialLinks card component

    - Build `src/components/SocialLinks/SocialLinks.tsx`
    - Display CardHeader with link icon and "Social Links" title
    - Render social buttons for LinkedIn, GitHub, Instagram
    - Show platform icon and name for each button
    - Links open in new tab (target="_blank")
    - Create `SocialLinks.module.css`
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 11.2 Write property test for SocialLinks






    - **Property 13: Social links render with correct attributes**
    - **Validates: Requirements 8.1, 8.2, 8.3**

- [x] 12. Implement Contact component






  - [x] 12.1 Create Contact card component

    - Build `src/components/Contact/Contact.tsx`
    - Display CardHeader with message icon and "Contact" title
    - Show availability status text
    - Add "Get in touch →" CTA link
    - Render contact buttons (Email with mailto:, Phone with tel:, Messenger with https://)
    - Create `Contact.module.css`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [x] 12.2 Write property test for Contact






    - **Property 14: Contact buttons have correct action protocols**
    - **Validates: Requirements 9.3, 9.4**

- [x] 13. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement Gallery component






  - [x] 14.1 Create Gallery section component

    - Build `src/components/Gallery/Gallery.tsx`
    - Display section header with image icon and "Gallery" title
    - Render images in horizontal layout with consistent height
    - Apply grayscale filter with color on hover
    - Limit display to 8 images maximum
    - Enable horizontal scroll on mobile
    - Create `Gallery.module.css`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - [x] 14.2 Write property test for Gallery






    - **Property 15: Gallery displays correct count of images**
    - **Validates: Requirements 10.1**

- [x] 15. Implement ChatWidget component






  - [x] 15.1 Create ChatWidget component

    - Build `src/components/ChatWidget/ChatWidget.tsx`
    - Create floating chat button positioned bottom-right
    - Implement expandable chat window with open/close state
    - Display developer name, avatar, and "Online" status in header
    - Render message history with timestamps
    - Add chat input field
    - Show "Any questions?" tooltip on hover when minimized
    - Create `ChatWidget.module.css`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  - [x] 15.2 Write property tests for ChatWidget










    - **Property 16: Chat widget displays profile info when open**
    - **Property 17: Chat messages appear with timestamps**
    - **Validates: Requirements 11.3, 11.4**

- [x] 16. Implement Footer component






  - [x] 16.1 Update Footer component

    - Update `src/components/Footer/Footer.tsx` with copyright text
    - Match design aesthetic with centered text
    - Update `Footer.module.css`
    - _Requirements: 14.1_

- [x] 17. Assemble BentoGrid layout and App





  - [x] 17.1 Create BentoGrid layout component

    - Build `src/components/BentoGrid/BentoGrid.tsx`
    - Implement CSS Grid layout matching design mockup
    - Position ProfileHeader spanning full width
    - Place About and Experience side by side
    - Place TechStack and Projects side by side
    - Arrange Goals, SocialLinks, Contact in row
    - Create `BentoGrid.module.css` with responsive grid
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 17.2 Update App component

    - Update `src/App.tsx` to use BentoGrid layout
    - Import and arrange all section components
    - Add ChatWidget as floating element
    - Add Footer at bottom
    - Update `src/App.css` with page background color
    - _Requirements: 12.3, 13.1_

  - [x] 17.3 Implement responsive breakpoints

    - Add tablet breakpoint (768-1024px) with 2-column adjustments
    - Add mobile breakpoint (<768px) with single-column stack
    - Ensure smooth transitions between breakpoints
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 18. Final Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.
