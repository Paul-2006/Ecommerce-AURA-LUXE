import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom Hook for Controlled Portal & Page Navigation
 * Enforces strict explicit portal navigation via UI controls / buttons.
 * Prevents unwanted mouse wheel, trackpad, or touchpad auto-portal switching.
 * Safely handles keyboard arrow shortcuts ONLY when user is NOT typing in form fields.
 */
export function useControlledNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Prevent mouse-wheel & touchpad scroll auto-portal switching
    const handleWheel = (event) => {
      // Allow ordinary element and body scrolling, but prevent any wheel-triggered route/portal changes
      event.stopPropagation();
    };

    // 2. Controlled Keyboard Navigation (Arrow Keys) - Scoped safely away from form inputs
    const handleKeyDown = (event) => {
      const activeEl = document.activeElement;
      const activeTag = activeEl?.tagName?.toUpperCase();
      const isEditable = activeEl?.isContentEditable;

      // DO NOT intercept keyboard shortcuts if user is inside form fields, search boxes, textareas, or select dropdowns
      if (
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        activeTag === "SELECT" ||
        activeTag === "OPTION" ||
        isEditable ||
        activeEl?.classList?.contains("input-modern") ||
        activeEl?.classList?.contains("nav-search-input") ||
        activeEl?.classList?.contains("compare-input-field")
      ) {
        return; // Allow normal typing and cursor movements
      }

      // Safe keyboard navigation shortcuts when not typing
      if (event.altKey) {
        switch (event.key) {
          case "ArrowRight":
            // Alt + Right: Go to Products
            event.preventDefault();
            navigate("/products");
            break;
          case "ArrowLeft":
            // Alt + Left: Go to Home
            event.preventDefault();
            navigate("/");
            break;
          case "ArrowUp":
            // Alt + Up: Scroll to top of current page
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            break;
          case "ArrowDown":
            // Alt + Down: Scroll down current page
            event.preventDefault();
            window.scrollBy({ top: 500, behavior: "smooth" });
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
}

export default useControlledNavigation;
