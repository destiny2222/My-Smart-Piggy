"use client";
import { useEffect } from 'react';

const useScrollAnimation = (
  location,
  className = 'js-scroll',
  scrolledClass = 'scrolled',
  onElementInView = null
) => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(`.${className}`));
    if (elements.length === 0) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) {
              el.classList.add(scrolledClass);
              if (onElementInView) onElementInView(el);
            } else {
              el.classList.remove(scrolledClass);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -5% 0px', // tweak if you want earlier/later removal
          threshold: 0, // any overlap counts as "in view"
        }
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }

    // ---- Fallback for older browsers ----
    const inView = (el) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // visible if any overlap with viewport
      return rect.top < vh && rect.bottom > 0;
    };

    const update = () => {
      elements.forEach((el) => {
        if (inView(el)) {
          el.classList.add(scrolledClass);
          if (onElementInView) onElementInView(el);
        } else {
          el.classList.remove(scrolledClass);
        }
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [className, scrolledClass, onElementInView, location]);
};

export default useScrollAnimation;
