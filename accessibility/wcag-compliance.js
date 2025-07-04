/**
 * WCAG 2.1 AA Compliance enhancements
 */

class AccessibilityEnhancer {
  static enhanceFormAccessibility() {
    // Add ARIA labels and descriptions
    this.addAriaLabels();
    this.addKeyboardNavigation();
    this.addScreenReaderSupport();
    this.addFocusManagement();
  }

  static addAriaLabels() {
    // Add comprehensive ARIA labels
    const form = document.getElementById('behaviorForm');
    if (form) {
      form.setAttribute('role', 'form');
      form.setAttribute('aria-label', 'Student Behavior Report Form');
    }

    // Section headings
    document.querySelectorAll('.section-title').forEach((title, index) => {
      title.setAttribute('role', 'heading');
      title.setAttribute('aria-level', '2');
      // Ensure sections have IDs to be referenced by aria-labelledby if needed
      const section = title.closest('.form-section');
      if (section && !section.id) {
        section.id = `form-section-${index}`;
      }
      if (section) {
        title.id = `section-heading-${index}`; // ensure title has id
        // If the section itself should be labelled by this title
        // section.setAttribute('aria-labelledby', title.id);
      }
    });

    // Form groups / sections
    document.querySelectorAll('.form-section').forEach((section, index) => {
      section.setAttribute('role', 'region');
      // If the section has a .section-title, it might be better to use aria-labelledby that title
      const sectionTitle = section.querySelector('.section-title');
      if (sectionTitle && sectionTitle.id) {
        section.setAttribute('aria-labelledby', sectionTitle.id);
      } else if (section.id) {
         // Fallback or provide a generic label if no title exists or title has no id
        section.setAttribute('aria-label', section.id.replace(/-/g, ' ') + ' section');
      }
    });
  }

  static addKeyboardNavigation() {
    // Enable keyboard navigation for custom elements
    document.querySelectorAll('.pillar-button, .behavior-item, .toggle-button, .location-button').forEach(button => {
      if (button.tagName.toLowerCase() !== 'button' && !button.hasAttribute('role')) {
        button.setAttribute('role', 'button');
      }
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }

      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click(); // Simulate a click event
        }
      });
    });
  }

  static addScreenReaderSupport() {
    // Add live regions for dynamic content updates
    let statusRegion = document.getElementById('status-announcements');
    if (!statusRegion) {
      statusRegion = document.createElement('div');
      statusRegion.setAttribute('aria-live', 'polite');
      statusRegion.setAttribute('aria-atomic', 'true');
      statusRegion.setAttribute('id', 'status-announcements');
      // Visually hide the region
      statusRegion.style.position = 'absolute';
      statusRegion.style.width = '1px';
      statusRegion.style.height = '1px';
      statusRegion.style.margin = '-1px';
      statusRegion.style.padding = '0';
      statusRegion.style.overflow = 'hidden';
      statusRegion.style.clip = 'rect(0, 0, 0, 0)';
      statusRegion.style.border = '0';
      document.body.appendChild(statusRegion);
    }

    // Announce form submission status
    // Ensure this function is globally accessible if called from outside this class
    window.announceToScreenReader = function(message) {
      if (statusRegion) {
        statusRegion.textContent = ''; // Clear previous message to ensure new message is read
        setTimeout(() => { // Timeout helps ensure the change is picked up by screen readers
            statusRegion.textContent = message;
        }, 100);
      }
    };
  }

  static addFocusManagement() {
    // Example: After a modal dialog closes, return focus to the element that opened it.
    // This is highly context-specific and would need to be integrated with UI components.
    // For now, this is a placeholder.
    console.log("Focus management enhancements would be implemented here.");

    // Focus on the first interactive element in a newly displayed section/modal
    // window.focusOnFirstElement = (containerSelector) => {
    //   const container = document.querySelector(containerSelector);
    //   if (container) {
    //     const focusableElements = container.querySelectorAll(
    //       'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    //     );
    //     if (focusableElements.length > 0) {
    //       focusableElements[0].focus();
    //     }
    //   }
    // };
  }
}

// Initialize accessibility enhancements when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      AccessibilityEnhancer.enhanceFormAccessibility();
    });
} else {
    // DOMContentLoaded has already fired
    AccessibilityEnhancer.enhanceFormAccessibility();
}
