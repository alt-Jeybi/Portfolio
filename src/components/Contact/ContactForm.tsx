import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { ContactFormData, ContactFormState } from '../../types';
import styles from './Contact.module.css';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formState, setFormState] = useState<ContactFormState>({
    status: 'idle',
    errorMessage: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    mode: 'onBlur',
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    setFormState({ status: 'submitting', errorMessage: null });

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setFormState({ status: 'success', errorMessage: null });
      reset();
    } catch (error) {
      // Preserve form data on network error - don't reset
      setFormState({
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      });
    }
  };

  if (formState.status === 'success') {
    return (
      <div className={styles.successMessage} data-testid="form-success">
        <h3>Message Sent!</h3>
        <p>Thank you for reaching out. I'll get back to you soon.</p>
        <button
          type="button"
          className={styles.submitButton}
          onClick={() => setFormState({ status: 'idle', errorMessage: null })}
        >
          Send Another Message
        </button>
      </div>
    );
  }


  return (
    <form
      className={styles.contactForm}
      onSubmit={handleSubmit(handleFormSubmit)}
      data-testid="contact-form"
      noValidate
    >
      {formState.status === 'error' && (
        <div className={styles.errorBanner} data-testid="form-error">
          {formState.errorMessage}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder="Your name"
          data-testid="name-input"
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name must be no more than 100 characters' },
          })}
        />
        {errors.name && (
          <span className={styles.errorMessage} data-testid="name-error">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder="your.email@example.com"
          data-testid="email-input"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />
        {errors.email && (
          <span className={styles.errorMessage} data-testid="email-error">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          Message
        </label>
        <textarea
          id="message"
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          placeholder="Your message..."
          rows={5}
          data-testid="message-input"
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters' },
            maxLength: { value: 1000, message: 'Message must be no more than 1000 characters' },
          })}
        />
        {errors.message && (
          <span className={styles.errorMessage} data-testid="message-error">
            {errors.message.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={formState.status === 'submitting'}
        data-testid="submit-button"
      >
        {formState.status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default ContactForm;
