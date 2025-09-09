import SEO from "../../components/SEO";

export default function PrivacyPolicy() {
  return (
    <main className="mx-[9%] px-6 py-10">
      <SEO
        title="Privacy Policy | Taab e Rukh"
        description="Official Privacy Policy of Taab e Rukh. Learn how we collect, use, and protect your personal information when shopping for herbal skincare products in Pakistan and worldwide."
        canonical="https://taaberukh.com/policies/privacy-policy"
        keywords={[
          "privacy policy Pakistan",
          "data protection Taab e Rukh",
          "herbal skincare privacy",
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy - Taab e Rukh",
          "description":
            "Learn how Taab e Rukh collects, uses, and protects your personal information while shopping for herbal skincare products in Pakistan and worldwide.",
          "publisher": {
            "@type": "Organization",
            "name": "Taab e Rukh",
            "url": "https://taaberukh.com",
          },
        }}
      />

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: September 8, 2025</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>
        <p>
          At <strong>Taab e Rukh</strong>, your privacy and confidentiality are
          of the utmost importance. This Privacy Policy explains how we collect,
          use, and protect your personal data when you visit our website
          (taaberukh.com) or purchase our herbal skincare and beauty products.
          By using our website, you agree to the practices outlined in this
          policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
        <p>
          We collect personal information necessary to process your orders and
          provide you with the best shopping experience. This may include:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Name, Email address, phone number, and shipping address </li>
          <li>
            Payment details (Easypaisa, JazzCash, or bank account)
          </li>
          <li>Order history and account login information</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How We Use Your Data</h2>
        <ul className="list-disc ml-6 mt-2">
          <li>Process and deliver your orders</li>
          <li>Verify payments and prevent fraudulent transactions</li>
          <li>
            Improve the layout, content, and functionality of our e-commerce
            website
          </li>
          <li>
            Send you product updates, promotions, or newsletters (optional
            opt-in)
          </li>
          <li>Conduct market research and understand customer preferences</li>
        </ul>
        <p className="mt-2">
          You can opt-out of marketing communications anytime by clicking
          “unsubscribe” in our emails or contacting us directly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sharing Your Information</h2>
        <p>
          We respect your privacy and do not sell or trade your personal data.
          However, we may share information with:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Courier partners to deliver your products</li>
          <li>
            Payment gateways (FastPay, JazzCash, Stripe, banks) for secure
            processing
          </li>
          <li>
            Legal authorities, if required by law for fraud protection or
            compliance
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cookies & Tracking</h2>
        <p>
          Our website uses cookies to improve your shopping experience, such as
          remembering your cart items or login details. We may also use{" "}
          <strong>Google Analytics</strong> to understand visitor behavior. You
          can disable cookies in your browser settings, but this may limit some
          website functionality.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Security</h2>
        <p>
          We use secure servers, encryption, and firewalls to safeguard your
          data. Access to your account is password-protected. Always keep your
          login credentials private to avoid unauthorized access.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal data at
          any time. You can also request us to stop sending marketing materials.
          Please contact us if you wish to exercise these rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
        <p>For any privacy-related questions or concerns, please contact us:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            <strong>Email:</strong> support@taaberukh.com
          </li>
          <li>
            <strong>Phone:</strong> +92-3XX-XXXXXXX
          </li>
          <li>
            <strong>Address:</strong> [Registered Business Address, Islamabad,
            Pakistan]
          </li>
          <li>
            <strong>Operating Hours:</strong> Monday – Saturday | 10:00 – 18:00
          </li>
        </ul>
      </section>
    </main>
  );
}
