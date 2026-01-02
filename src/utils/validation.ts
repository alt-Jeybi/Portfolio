/**
 * Form validation utilities for contact form
 * Implements validators: required, email format, min/max length
 * Returns specific error messages for each validation failure
 */

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates that a field is not empty
 */
export function required(value: string, fieldName: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
}

/**
 * Validates email format using a standard regex pattern
 */
export function isValidEmail(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }
  
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates minimum length of a string
 */
export function minLength(value: string, min: number, fieldName: string): ValidationResult {
  const trimmed = value.trim();
  if (trimmed.length < min) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least ${min} characters` 
    };
  }
  return { isValid: true, error: null };
}

/**
 * Validates maximum length of a string
 */
export function maxLength(value: string, max: number, fieldName: string): ValidationResult {
  const trimmed = value.trim();
  if (trimmed.length > max) {
    return { 
      isValid: false, 
      error: `${fieldName} must be no more than ${max} characters` 
    };
  }
  return { isValid: true, error: null };
}

/**
 * Validates name field: required, 2-100 characters
 */
export function validateName(value: string): ValidationResult {
  const requiredCheck = required(value, 'Name');
  if (!requiredCheck.isValid) return requiredCheck;
  
  const minCheck = minLength(value, 2, 'Name');
  if (!minCheck.isValid) return minCheck;
  
  const maxCheck = maxLength(value, 100, 'Name');
  if (!maxCheck.isValid) return maxCheck;
  
  return { isValid: true, error: null };
}

/**
 * Validates email field: required, valid format
 */
export function validateEmail(value: string): ValidationResult {
  return isValidEmail(value);
}

/**
 * Validates message field: required, 10-1000 characters
 */
export function validateMessage(value: string): ValidationResult {
  const requiredCheck = required(value, 'Message');
  if (!requiredCheck.isValid) return requiredCheck;
  
  const minCheck = minLength(value, 10, 'Message');
  if (!minCheck.isValid) return minCheck;
  
  const maxCheck = maxLength(value, 1000, 'Message');
  if (!maxCheck.isValid) return maxCheck;
  
  return { isValid: true, error: null };
}

/**
 * Validates entire contact form
 */
export interface ContactFormErrors {
  name: string | null;
  email: string | null;
  message: string | null;
}

export function validateContactForm(data: { name: string; email: string; message: string }): {
  isValid: boolean;
  errors: ContactFormErrors;
} {
  const nameResult = validateName(data.name);
  const emailResult = validateEmail(data.email);
  const messageResult = validateMessage(data.message);
  
  return {
    isValid: nameResult.isValid && emailResult.isValid && messageResult.isValid,
    errors: {
      name: nameResult.error,
      email: emailResult.error,
      message: messageResult.error,
    },
  };
}
