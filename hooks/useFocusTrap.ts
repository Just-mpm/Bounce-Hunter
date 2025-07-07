import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface FocusTrapOptions {
  onDeactivate?: () => void;
}

const useFocusTrap = (
  ref: React.RefObject<HTMLElement | null>,
  options: FocusTrapOptions = {}
) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const focusableElements = Array.from(
      element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (event.key === 'Escape') {
        if (typeof options.onDeactivate === 'function') {
          options.onDeactivate();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [ref, options.onDeactivate]);
};

export default useFocusTrap;