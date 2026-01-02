import { useState, useRef, useEffect } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import profileData from '../../data/profile.json';
import type { Profile, ChatMessage, ChatState } from '../../types';
import styles from './ChatWidget.module.css';

const profile = profileData as Profile;

interface ChatWidgetProps {
  name?: string;
  avatar?: string;
  initialMessages?: ChatMessage[];
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatWidget({
  name = profile.name,
  avatar = profile.avatar,
  initialMessages = []
}: ChatWidgetProps) {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    messages: initialMessages
  });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatState.isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatState.messages, chatState.isOpen]);

  const toggleChat = () => {
    setChatState(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  const handleSendMessage = (e?: FormEvent) => {
    e?.preventDefault();
    
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: trimmedInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
    setInputValue('');
    
    // Trigger auto-reply
    sendAutoReply(trimmedInput);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-reply responses
  const getAutoReply = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening')) {
      return `Hi there! Thanks for reaching out. I'm currently away, but feel free to leave a message or email me at ${profile.email}. I'll get back to you soon!`;
    }
    
    // Farewells
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you') || lowerMessage.includes('take care')) {
      return "Thanks for chatting! Feel free to come back anytime. Have a great day! 👋";
    }
    
    // Thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
      return "You're welcome! Let me know if there's anything else I can help with. 😊";
    }
    
    // ===== CLIENT/BUSINESS REQUESTS =====
    
    // Need a website
    if (lowerMessage.includes('need a website') || lowerMessage.includes('want a website') || lowerMessage.includes('build me a website') || lowerMessage.includes('create a website') || lowerMessage.includes('make a website') || lowerMessage.includes('looking for a website')) {
      return "I'd love to help you build a website! Please tell me more about your business and what kind of website you're looking for. I'll get back to you with ideas and a quote. 🚀";
    }
    
    // Business website
    if (lowerMessage.includes('business') || lowerMessage.includes('company') || lowerMessage.includes('startup') || lowerMessage.includes('enterprise')) {
      return "I specialize in creating professional websites for businesses! Whether you need a landing page, company website, or e-commerce store, I can help. Tell me more about your business!";
    }
    
    // Online store / E-commerce
    if (lowerMessage.includes('online store') || lowerMessage.includes('e-commerce') || lowerMessage.includes('ecommerce') || lowerMessage.includes('sell online') || lowerMessage.includes('shop') || lowerMessage.includes('selling products')) {
      return "I can build you an online store to sell your products! I work with modern e-commerce solutions. Let me know what products you're selling and I'll help you get started.";
    }
    
    // Landing page
    if (lowerMessage.includes('landing page') || lowerMessage.includes('one page') || lowerMessage.includes('single page') || lowerMessage.includes('simple website')) {
      return "A landing page is a great way to showcase your business! I can create a beautiful, responsive landing page that converts visitors into customers. What's your business about?";
    }
    
    // Mobile app
    if (lowerMessage.includes('mobile app') || lowerMessage.includes('android') || lowerMessage.includes('ios') || lowerMessage.includes('app for my') || lowerMessage.includes('phone app')) {
      return "I also develop mobile apps! Tell me about your app idea - what problem does it solve? I'd love to help bring your vision to life. 📱";
    }
    
    // Redesign / Revamp
    if (lowerMessage.includes('redesign') || lowerMessage.includes('revamp') || lowerMessage.includes('update my website') || lowerMessage.includes('improve my website') || lowerMessage.includes('fix my website') || lowerMessage.includes('old website')) {
      return "I can help modernize your existing website! Share your current website URL and tell me what you'd like to improve. I'll give you recommendations and a quote.";
    }
    
    // Logo / Branding
    if (lowerMessage.includes('logo') || lowerMessage.includes('branding') || lowerMessage.includes('brand') || lowerMessage.includes('design')) {
      return "While my main focus is web development, I can help with basic branding and design for your website. Tell me more about your brand vision!";
    }
    
    // Restaurant / Food
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('cafe') || lowerMessage.includes('menu') || lowerMessage.includes('catering')) {
      return "I can create a beautiful website for your restaurant or food business! Features like online menus, reservations, and ordering systems are all possible. Tell me more about your place!";
    }
    
    // Salon / Beauty
    if (lowerMessage.includes('salon') || lowerMessage.includes('beauty') || lowerMessage.includes('spa') || lowerMessage.includes('hair') || lowerMessage.includes('nail') || lowerMessage.includes('makeup')) {
      return "I'd love to create a stunning website for your beauty business! I can include booking systems, service menus, and galleries to showcase your work. What services do you offer?";
    }
    
    // Real Estate
    if (lowerMessage.includes('real estate') || lowerMessage.includes('property') || lowerMessage.includes('house') || lowerMessage.includes('apartment') || lowerMessage.includes('rental')) {
      return "I can build a professional real estate website with property listings, search features, and contact forms. Tell me more about your real estate business!";
    }
    
    // Portfolio / Personal
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('personal website') || lowerMessage.includes('my own website') || lowerMessage.includes('showcase my work')) {
      return "A portfolio website is perfect for showcasing your work! I can create something similar to this site, customized for you. What kind of work do you want to display?";
    }
    
    // Blog
    if (lowerMessage.includes('blog') || lowerMessage.includes('write') || lowerMessage.includes('articles') || lowerMessage.includes('content')) {
      return "I can set up a beautiful blog for you! Whether it's personal blogging or content marketing for your business, I've got you covered. What topics will you write about?";
    }
    
    // Booking / Appointment
    if (lowerMessage.includes('booking') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('reservation')) {
      return "I can integrate booking and appointment systems into your website! This is great for service-based businesses. What kind of appointments do you need to manage?";
    }
    
    // How long / Timeline
    if (lowerMessage.includes('how long') || lowerMessage.includes('timeline') || lowerMessage.includes('deadline') || lowerMessage.includes('when can') || lowerMessage.includes('turnaround')) {
      return "Project timelines depend on complexity. A simple landing page takes about 1-2 weeks, while larger projects may take 4-8 weeks. Share your requirements and deadline, and I'll let you know if I can meet it!";
    }
    
    // How much / Payment
    if (lowerMessage.includes('how much') || lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('deposit') || lowerMessage.includes('installment')) {
      return "Pricing varies based on project scope. I offer flexible payment options including deposits and installments. Let's discuss your project first, and I'll provide a detailed quote!";
    }
    
    // Maintenance / Updates
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('update') || lowerMessage.includes('manage') || lowerMessage.includes('after') || lowerMessage.includes('support after')) {
      return "Yes, I offer website maintenance and support! I can help you keep your site updated, secure, and running smoothly. We can discuss a maintenance plan that works for you.";
    }
    
    // Domain / Hosting
    if (lowerMessage.includes('domain') || lowerMessage.includes('hosting') || lowerMessage.includes('server') || lowerMessage.includes('publish') || lowerMessage.includes('go live')) {
      return "I can help you with domain registration and hosting setup! I'll guide you through the process and make sure your website goes live smoothly. 🌐";
    }
    
    // SEO
    if (lowerMessage.includes('seo') || lowerMessage.includes('google') || lowerMessage.includes('search engine') || lowerMessage.includes('ranking') || lowerMessage.includes('found online')) {
      return "I build websites with SEO best practices in mind! This helps your site rank better on Google. I can also provide basic SEO optimization as part of the project.";
    }
    
    // Social Media Integration
    if (lowerMessage.includes('facebook') || lowerMessage.includes('instagram') || lowerMessage.includes('twitter') || lowerMessage.includes('social media integration')) {
      return "I can integrate your social media accounts into your website! This includes feeds, share buttons, and links to your profiles. Which platforms do you use?";
    }
    
    // ===== ORIGINAL CATEGORIES =====
    
    // Projects & Work
    if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('collaborate')) {
      return "I'd love to discuss potential projects! Please share some details about what you have in mind, and I'll respond as soon as I'm available. You can also check out my Projects section to see my previous work!";
    }
    
    // Hiring & Jobs
    if (lowerMessage.includes('hire') || lowerMessage.includes('job') || lowerMessage.includes('opportunity') || lowerMessage.includes('position') || lowerMessage.includes('vacancy') || lowerMessage.includes('recruit')) {
      return "Thanks for considering me! I'm always open to new opportunities. Please send the details to my email and I'll review them promptly. Looking forward to hearing from you!";
    }
    
    // Contact Info
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
      return `You can reach me at ${profile.email}. I typically respond within 24 hours! You can also find me on LinkedIn and GitHub through the social links on this page.`;
    }
    
    // Skills & Tech
    if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('stack') || lowerMessage.includes('programming') || lowerMessage.includes('language')) {
      return "Check out my Skills section on this page to see my tech stack! I work with React, TypeScript, and various modern web technologies. Feel free to ask about any specific technology.";
    }
    
    // Experience & Background
    if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('career') || lowerMessage.includes('history')) {
      return "You can find my professional experience in the Experience section of this page. I'm a BSIT student with hands-on experience in web and mobile development!";
    }
    
    // Education
    if (lowerMessage.includes('education') || lowerMessage.includes('school') || lowerMessage.includes('university') || lowerMessage.includes('degree') || lowerMessage.includes('study')) {
      return "I'm currently a 4th year BS Information Technology student. Check out my Experience section for more details about my educational background!";
    }
    
    // Availability
    if (lowerMessage.includes('available') || lowerMessage.includes('free') || lowerMessage.includes('busy')) {
      return "I'm currently open to freelance projects and job opportunities! Feel free to share your timeline and requirements, and I'll let you know my availability.";
    }
    
    // Pricing & Rates
    if (lowerMessage.includes('price') || lowerMessage.includes('rate') || lowerMessage.includes('cost') || lowerMessage.includes('budget') || lowerMessage.includes('charge') || lowerMessage.includes('fee')) {
      return "Pricing depends on the project scope and requirements. Let's discuss your project details first, and I'll provide a fair quote. Send me the specifics via email!";
    }
    
    // Services
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('provide') || lowerMessage.includes('do you do')) {
      return "I offer web development, mobile app development, and UI/UX design services. Check out my Projects section to see examples of my work!";
    }
    
    // Resume/CV
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv') || lowerMessage.includes('curriculum')) {
      return "You can download my resume from the link on this page. It has all my skills, experience, and education details!";
    }
    
    // Location
    if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('based') || lowerMessage.includes('country') || lowerMessage.includes('city')) {
      return `I'm based in ${profile.location}. I'm open to remote work and collaborations worldwide!`;
    }
    
    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('assist')) {
      return "I'm happy to help! You can ask me about my services, pricing, timeline, or anything else. What would you like to know?";
    }
    
    // Who are you
    if (lowerMessage.includes('who are you') || lowerMessage.includes('about you') || lowerMessage.includes('tell me about') || lowerMessage.includes('introduce')) {
      return `I'm ${profile.name}, a ${profile.title}. I help businesses and individuals create beautiful, functional websites and apps. Check out the About section to learn more!`;
    }
    
    // Compliments
    if (lowerMessage.includes('nice') || lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('cool') || lowerMessage.includes('amazing') || lowerMessage.includes('love') || lowerMessage.includes('beautiful') || lowerMessage.includes('impressive')) {
      return "Thank you so much! I really appreciate the kind words. 😊 Let me know if there's anything I can help you with!";
    }
    
    // Interested / Want to work together
    if (lowerMessage.includes('interested') || lowerMessage.includes('want to work') || lowerMessage.includes('work together') || lowerMessage.includes('work with you')) {
      return "That's great to hear! I'd love to work with you. Tell me more about what you need, and let's make it happen! 🎯";
    }
    
    // Questions
    if (lowerMessage.includes('?') || lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('when') || lowerMessage.includes('why') || lowerMessage.includes('can you')) {
      return "Great question! I'm currently away, but I'll get back to you with a detailed answer soon. Feel free to email me for a faster response!";
    }
    
    // Default response
    return "Thanks for your message! I'm currently away but I'll get back to you as soon as possible. You can also reach me directly at " + profile.email + ". Looking forward to connecting with you!";
  };

  // Send auto-reply after user message
  const sendAutoReply = (userMessage: string) => {
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: getAutoReply(userMessage),
        sender: 'owner',
        timestamp: new Date()
      };
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, replyMessage]
      }));
    }, 1000); // 1 second delay to feel natural
  };

  // Render minimized chat button
  if (!chatState.isOpen) {
    return (
      <button
        className={styles.chatButton}
        onClick={toggleChat}
        aria-label="Open chat"
        data-testid="chat-button"
      >
        <FiMessageCircle className={styles.chatButtonIcon} />
        <span className={styles.tooltip} data-testid="chat-tooltip">
          Any questions?
        </span>
      </button>
    );
  }

  // Render expanded chat window
  return (
    <div className={styles.chatWindow} data-testid="chat-window">
      {/* Chat Header */}
      <div className={styles.chatHeader} data-testid="chat-header">
        <img
          src={avatar}
          alt={`${name}'s avatar`}
          className={styles.chatAvatar}
          data-testid="chat-avatar"
        />
        <div className={styles.chatHeaderInfo}>
          <h3 className={styles.chatHeaderName} data-testid="chat-name">
            {name}
          </h3>
          <div className={styles.chatHeaderStatus} data-testid="chat-status">
            <span className={styles.statusDot} />
            <span>Online</span>
          </div>
        </div>
        <button
          className={styles.closeButton}
          onClick={toggleChat}
          aria-label="Close chat"
          data-testid="chat-close-button"
        >
          <FiX className={styles.closeButtonIcon} />
        </button>
      </div>

      {/* Messages Container */}
      <div className={styles.messagesContainer} data-testid="messages-container">
        {chatState.messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>
              Start a conversation! Send a message below.
            </p>
          </div>
        ) : (
          chatState.messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.messageUser : styles.messageOwner
              }`}
              data-testid={`message-${message.sender}`}
            >
              <p className={styles.messageContent}>{message.content}</p>
              <span className={styles.messageTimestamp} data-testid="message-timestamp">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form className={styles.chatInputContainer} onSubmit={handleSendMessage}>
        <input
          type="text"
          className={styles.chatInput}
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Chat message input"
          data-testid="chat-input"
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!inputValue.trim()}
          aria-label="Send message"
          data-testid="send-button"
        >
          <FiSend className={styles.sendButtonIcon} />
        </button>
      </form>
    </div>
  );
}

export default ChatWidget;
