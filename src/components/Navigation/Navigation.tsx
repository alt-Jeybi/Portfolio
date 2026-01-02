import { useState, useCallback } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from './Navigation.module.css';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }

      closeMenu();
    },
    [closeMenu]
  );

  return (
    <nav className={styles.navigation} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <a href="#hero" className={styles.logo} onClick={(e) => handleNavClick(e, '#hero')}>
          Portfolio
        </a>

        {/* Desktop Navigation */}
        <ul className={styles.desktopNav}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.navLink}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}
          aria-hidden={!isMenuOpen}
        >
          <ul className={styles.mobileNavList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={(e) => handleNavClick(e, link.href)}
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
