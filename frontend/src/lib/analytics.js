// frontend/src/lib/analytics.js

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize GA4
export const initGA = () => {
  if (!window.gtag) {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
    `;
    document.head.appendChild(script2);
  }
};

// Track page views (React Router SPA)
export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
  }
};

// Track custom events
export const trackEvent = ({ action, category, label, value }) => {
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

// Prebuilt e-commerce events
export const trackAddToCart = (product) => {
  trackEvent({
    action: "add_to_cart",
    category: "ecommerce",
    label: product.name,
    value: product.price,
  });
};

export const trackPurchase = (order) => {
  trackEvent({
    action: "purchase",
    category: "ecommerce",
    label: `Order ${order._id}`,
    value: order.totalAmount,
  });
};
