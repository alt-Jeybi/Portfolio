// Profile data structures
export interface ExperienceEntry {
  id: string;
  title: string;
  description: string;
  year: number;
  isCurrent: boolean;
}

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'instagram' | 'email' | 'twitter';
  url: string;
}

export interface Profile {
  name: string;
  verified: boolean;
  location: string;
  title: string;
  avatar: string;
  resumeUrl: string;
  email: string;
  phone: string;
  messengerUrl: string;
  bio: string[];
  experience: ExperienceEntry[];
  goals: string[];
  socialLinks: SocialLink[];
}

// Tech Stack structure
export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  category: string;
  displayName: string;
  skills: Skill[];
}

export interface TechStackData {
  categories: SkillCategory[];
}

// Education type for About section
export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | null;
}

// Experience type for About section
export interface Experience {
  role: string;
  organization: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

// Project data structure
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
}

export interface ProjectsData {
  projects: Project[];
}

// Certification data structure
export interface Certification {
  id: string;
  name: string;
  issuer: string;
}

export interface CertificationsData {
  certifications: Certification[];
}

// Gallery data structure
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface GalleryData {
  images: GalleryImage[];
}

// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'owner';
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
}

// Contact form types (kept for compatibility)
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  errorMessage: string | null;
}
