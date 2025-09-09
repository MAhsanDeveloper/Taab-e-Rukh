import SEO from "../../components/SEO";

const TermsOfService = () => {
  return (
    <>
      <SEO
        title="Terms of Service - Taab e Rukh"
        description="Read the official Terms of Service for Taab e Rukh. Learn about our policies on orders, payments, returns, user responsibilities, and more."
      />

      <div className="mx-[9%] px-6 py-12 text-gray-800 leading-relaxed">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
        <p className="mb-8">
          Welcome to <strong>Taab e Rukh</strong>. Please read these Terms of
          Service carefully before accessing or using our website. By accessing
          or using any part of the site, you agree to be bound by these Terms of
          Service. If you do not agree to all the terms and conditions of this
          agreement, then you may not access the website or use any services. If
          these Terms of Service are considered an offer, acceptance is
          expressly limited to these Terms of Service.
        </p>

        <p className="mb-4">
          This website is owned and operated by <strong>Taab e Rukh</strong>.
          The terms "we", "us", and "our" refer to Taab e Rukh. Throughout the
          site, these terms and conditions apply to all users, including
          visitors, registered customers, merchants, and contributors of
          content. By using our services, you accept these terms in full.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
        <p className="mb-4">
          By agreeing to these Terms, you confirm that you are at least 18 years
          of age or using our services under the supervision of a parent or
          legal guardian. You also agree that you will not use our services for
          any unlawful or unauthorized purpose.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          3. General Conditions
        </h2>
        <p className="mb-4">
          We reserve the right to refuse service to anyone at any time for any
          reason. Your personal and payment information may be transmitted
          securely across networks and encrypted where necessary. You agree not
          to misuse, duplicate, resell, or exploit our services without our
          written permission.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          4. Accuracy of Information
        </h2>
        <p className="mb-4">
          While we aim to provide accurate and updated product details, pricing,
          and availability, occasional errors may occur. We do not guarantee
          that all information on our website will be error-free or complete.
          Any reliance on the material on this site is at your own risk.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          5. Orders & Payments
        </h2>
        <p className="mb-4">
          All orders placed on our website are subject to acceptance and
          availability. We reserve the right to limit or cancel any order.
          Payments can be made via{" "}
          <strong>
            JazzCash, Easypaisa, Bank Transfer, Stripe, and Cash on Delivery
            (COD)
          </strong>
          . By completing a purchase, you agree to provide current, accurate,
          and complete billing details.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          6. Products & Services
        </h2>
        <p className="mb-4">
          Some products may be available in limited quantities. Colors and
          packaging may appear differently due to device display variations. We
          reserve the right to discontinue or modify any product at any time
          without prior notice. We also reserve the right to limit sales by
          region, user, or order quantity.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          7. Returns & Refunds
        </h2>
        <p className="mb-4">
          We accept returns of defective or damaged products within{" "}
          <strong>14 days</strong> of delivery. Refunds will be issued using the
          original payment method (Bank, JazzCash, Easypaisa, Stripe, COD). For
          full details, please review our{" "}
          <a href="/return-refund-policy" className="text-green-600 underline">
            Return & Refund Policy
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          8. User Comments & Feedback
        </h2>
        <p className="mb-4">
          If you provide suggestions, reviews, or feedback, you grant us the
          right to use, edit, and share them for improving our services. You are
          responsible for ensuring your submissions are accurate and lawful.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Prohibited Uses</h2>
        <p className="mb-4">
          You agree not to use our website or services for unlawful purposes,
          including but not limited to: spreading harmful code, phishing,
          spamming, impersonation, harassment, or violating intellectual
          property rights. Any misuse will result in account suspension or
          termination.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          10. Limitation of Liability
        </h2>
        <p className="mb-4">
          Our services and products are provided on an "as is" basis without any
          warranties. Taab e Rukh shall not be held liable for damages,
          including but not limited to, lost profits, data loss, delays, or
          errors in service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Governing Law</h2>
        <p className="mb-4">
          These Terms of Service shall be governed by and interpreted in
          accordance with the laws of <strong>Pakistan</strong>. Any disputes
          shall be resolved under the exclusive jurisdiction of courts in
          Pakistan.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          12. Updates to Terms
        </h2>
        <p className="mb-4">
          We reserve the right to update, change, or replace any part of these
          Terms of Service at any time. Please review this page periodically for
          updates. Continued use of our website means you accept these changes.
        </p>

        <p className="mt-10 font-medium">
          If you have any questions about these Terms of Service, please{" "}
          <a href="/contact" className="text-green-600 underline">
            contact us
          </a>
          .
        </p>
      </div>
    </>
  );
};

export default TermsOfService;
