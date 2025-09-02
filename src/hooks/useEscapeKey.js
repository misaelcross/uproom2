import { useEffect } from 'react';

/**
 * Custom hook to handle Escape key press events
 * @param {Function} callback - Function to call when Escape key is pressed
 * @param {boolean} enabled - Whether the hook should be active (default: true)
 */
const useEscapeKey = (callback, enabled = true) => {
  useEffect(() => {
    if (!enabled || typeof callback !== 'function') {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled]);
};

export default useEscapeKey;