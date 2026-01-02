import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { ChatWidget } from './ChatWidget';

/**
 * **Feature: portfolio-website, Property 16: Chat widget displays profile info when open**
 * **Validates: Requirements 11.3**
 *
 * For any valid profile data with name and avatar, when the chat widget is open,
 * it SHALL display the developer's name and avatar.
 */

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Arbitrary for generating valid names
const nameArbitrary = fc.string({ minLength: 1, maxLength: 100 })
  .filter(s => s.trim().length > 0);

// Arbitrary for generating valid avatar URLs
const avatarArbitrary = fc.oneof(
  fc.webUrl(),
  fc.constant('/images/avatar.jpg'),
  fc.constant('/avatar.png')
);

// Arbitrary for generating valid chat messages
const chatMessageArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => `msg-${s}`),
  content: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  sender: fc.constantFrom('user', 'owner') as fc.Arbitrary<'user' | 'owner'>,
  timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
    .filter(d => !isNaN(d.getTime())),
});

describe('Property 16: Chat widget displays profile info when open', () => {
  /**
   * **Feature: portfolio-website, Property 16: Chat widget displays profile info when open**
   * **Validates: Requirements 11.3**
   */
  it('should display name and avatar when chat is open for any valid profile data', () => {
    fc.assert(
      fc.property(nameArbitrary, avatarArbitrary, (name, avatar) => {
        cleanup();
        
        // Render with initial messages to ensure chat window can be opened
        render(
          <ChatWidget name={name} avatar={avatar} initialMessages={[]} />
        );
        
        // Initially, the chat button should be visible (chat is closed)
        const chatButton = screen.getByTestId('chat-button');
        expect(chatButton).toBeInTheDocument();
        
        // Click to open the chat
        fireEvent.click(chatButton);
        
        // Now the chat window should be visible
        const chatWindow = screen.getByTestId('chat-window');
        expect(chatWindow).toBeInTheDocument();
        
        // Verify name is displayed in the header
        const chatName = screen.getByTestId('chat-name');
        expect(chatName).toBeInTheDocument();
        expect(chatName.textContent).toBe(name);
        
        // Verify avatar is displayed in the header
        const chatAvatar = screen.getByTestId('chat-avatar');
        expect(chatAvatar).toBeInTheDocument();
        expect(chatAvatar).toHaveAttribute('src', avatar);
        expect(chatAvatar).toHaveAttribute('alt', `${name}'s avatar`);
      }),
      { numRuns: 100 }
    );
  });

  it('should display online status when chat is open', () => {
    fc.assert(
      fc.property(nameArbitrary, avatarArbitrary, (name, avatar) => {
        cleanup();
        
        render(<ChatWidget name={name} avatar={avatar} initialMessages={[]} />);
        
        // Open the chat
        const chatButton = screen.getByTestId('chat-button');
        fireEvent.click(chatButton);
        
        // Verify online status is displayed
        const chatStatus = screen.getByTestId('chat-status');
        expect(chatStatus).toBeInTheDocument();
        expect(chatStatus.textContent).toContain('Online');
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: portfolio-website, Property 17: Chat messages appear with timestamps**
 * **Validates: Requirements 11.4**
 *
 * For any message sent through the chat widget, the message SHALL appear
 * in the chat history with a timestamp.
 */
describe('Property 17: Chat messages appear with timestamps', () => {
  /**
   * **Feature: portfolio-website, Property 17: Chat messages appear with timestamps**
   * **Validates: Requirements 11.4**
   */
  it('should display messages with timestamps for any valid initial messages', () => {
    fc.assert(
      fc.property(
        fc.array(chatMessageArbitrary, { minLength: 1, maxLength: 10 }),
        (messages) => {
          cleanup();
          
          render(
            <ChatWidget
              name="Test User"
              avatar="/test.jpg"
              initialMessages={messages}
            />
          );
          
          // Open the chat
          const chatButton = screen.getByTestId('chat-button');
          fireEvent.click(chatButton);
          
          // Verify all messages are displayed with timestamps
          const timestamps = screen.getAllByTestId('message-timestamp');
          expect(timestamps.length).toBe(messages.length);
          
          // Each timestamp should be non-empty
          timestamps.forEach((timestamp) => {
            expect(timestamp.textContent).toBeTruthy();
            expect(timestamp.textContent!.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display timestamp in correct time format for any message', () => {
    fc.assert(
      fc.property(chatMessageArbitrary, (message) => {
        cleanup();
        
        render(
          <ChatWidget
            name="Test User"
            avatar="/test.jpg"
            initialMessages={[message]}
          />
        );
        
        // Open the chat
        const chatButton = screen.getByTestId('chat-button');
        fireEvent.click(chatButton);
        
        // Verify timestamp is displayed
        const timestamp = screen.getByTestId('message-timestamp');
        expect(timestamp).toBeInTheDocument();
        
        // Timestamp should match the expected format (HH:MM AM/PM or HH:MM)
        const timestampText = timestamp.textContent!;
        // The format should contain digits and possibly : and AM/PM
        expect(timestampText).toMatch(/\d{1,2}:\d{2}/);
      }),
      { numRuns: 100 }
    );
  });

  it('should display message content alongside timestamp', () => {
    fc.assert(
      fc.property(chatMessageArbitrary, (message) => {
        cleanup();
        
        render(
          <ChatWidget
            name="Test User"
            avatar="/test.jpg"
            initialMessages={[message]}
          />
        );
        
        // Open the chat
        const chatButton = screen.getByTestId('chat-button');
        fireEvent.click(chatButton);
        
        // Verify message content is displayed
        const messageElement = screen.getByTestId(`message-${message.sender}`);
        expect(messageElement).toBeInTheDocument();
        expect(messageElement.textContent).toContain(message.content);
        
        // Verify timestamp is within the same message element
        const timestamp = screen.getByTestId('message-timestamp');
        expect(messageElement.contains(timestamp)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
