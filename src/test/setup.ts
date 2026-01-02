import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock scrollIntoView for JSDOM (not implemented in JSDOM)
Element.prototype.scrollIntoView = vi.fn();

// Mock IntersectionObserver for scroll animation tests
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor(private callback: IntersectionObserverCallback) {}
  
  observe(target: Element): void {
    // Immediately trigger callback with isIntersecting: true for tests
    this.callback([{
      target,
      isIntersecting: true,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    }], this);
  }
  
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

global.IntersectionObserver = MockIntersectionObserver;
