import SEO from "../../components/SEO";

const ShippingPolicy = () => {
  return (
    <div className="mx-[9%] px-6 py-12 text-gray-800 leading-relaxed">
      <SEO
        title="Shipping Policy | Taab e Rukh"
        description="Read Taab e Rukh's shipping policy. Free shipping on orders above PKR 5,000. Fast and reliable delivery across Pakistan within 1–5 business days."
        canonical="https://taaberukh.com/shipping-policy"
        keywords={[
          "shipping policy Pakistan",
          "free shipping herbal products",
          "Taab e Rukh delivery",
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Shipping Policy - Taab e Rukh",
          description:
            "Free shipping on orders above PKR 5,000. Delivery across Pakistan in 3–5 business days.",
          publisher: {
            "@type": "Organization",
            name: "Taab e Rukh",
            url: "https://taaberukh.com",
          },
        }}
      />

      {/* Page Content */}
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
      <p className="mb-6">
        Thank you for shopping with <strong>Taab e Rukh</strong>. We strive to
        process and deliver your orders as quickly and safely as possible.
        Please review our shipping policy below for full details.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        1. Order Processing Time
      </h2>
      <p>
        Orders are processed within <strong>3–5 working days</strong> after
        payment confirmation. Processing may take longer during holidays,
        promotions, or peak demand. Any delays will be communicated via{" "}
        <strong>email or SMS</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Shipping Options</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Standard Shipping: Delivered within 3–5 working days.</li>
        <li>Expedited Shipping: Delivered within 2–4 working days.</li>
        <li>Express Shipping: Delivered within 1–2 working days.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Shipping Rates</h2>
      <p>
        Shipping costs are calculated at checkout based on order weight, size,
        and destination.
      </p>
      <p className="mt-2 font-semibold">
       Free Shipping: Orders above PKR 5,000 qualify for free standard
        shipping across Pakistan.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        4. Shipping Destinations
      </h2>
      <p>
        We currently ship <strong>within Pakistan only</strong>. For
        international shipping requests, contact us at{" "}
        <a
          href="mailto:support@taaberukh.com"
          className="text-blue-600 underline"
        >
          support@taaberukh.com
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        5. Tracking Your Order
      </h2>
      <p>
        Once shipped, you will receive a confirmation email with a{" "}
        <strong>tracking number</strong>. You can track your order directly on
        our courier partner’s website.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        6. Delivery Times & Delays
      </h2>
      <p>
        Delivery times are estimates and may vary due to your location, courier
        delays, weather disruptions, or other unforeseen circumstances.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        7. Undeliverable or Returned Packages
      </h2>
      <p>
        If an order is returned due to an incorrect address, failure to receive
        the package, or unpaid fees, reshipment costs will be charged to the
        customer.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        8. Lost or Stolen Packages
      </h2>
      <p>
        <strong>Taab e Rukh</strong> is not responsible for lost or stolen
        packages once marked as delivered by the courier. Customers are advised
        to provide a secure delivery location or request signature confirmation
        where available.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        9. Contact Information
      </h2>
      <p>For shipping inquiries, contact us:</p>
      <ul className="mt-3 space-y-2">
        <li>
          📍 <strong>Taab e Rukh Headquarters</strong>, Islamabad, Pakistan
        </li>
        <li>📞 +92 325 0123455</li>
        <li>
          📧{" "}
          <a
            href="mailto:support@taaberukh.com"
            className="text-blue-600 underline"
          >
            support@taaberukh.com
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ShippingPolicy;
