import { Helmet } from "react-helmet-async";

export default function ReturnRefundPolicy() {
  return (
    <main className="mx-[9%] px-6 py-10">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Refund & Return Policy | Taab e Rukh</title>
        <meta
          name="description"
          content="Learn about Taab e Rukh's Return & Refund Policy. Return damaged or defective products within 7 days. Refunds are issued via the same payment method used."
        />
        <link
          rel="canonical"
          href="https://thesgrgroup.com/return-refund-policy"
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Return & Refund Policy</h1>
      <p className="mb-4">Last updated: September 18, 2025</p>

      {/* ✅ Section 1 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Eligibility for Returns</h2>
        <p>
          We accept returns on products that are{" "}
          <strong>damaged, defective, or incorrect</strong> upon delivery.
          Customers must notify us within{" "}
          <strong>14 days of receiving their order</strong> to be eligible for a
          return or exchange.
        </p>
      </section>

      {/* ✅ Section 2 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Conditions for Return</h2>
        <p>You can return your item(s) within 7 days of receiving your order, provided the following conditions are met:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Item must be unused and in its original packaging.</li>
          <li>
            Proof of purchase (order number, invoice, or receipt) is required.
          </li>
          <li>
            Certain items (such as opened skincare products, promotional items,
            or gift cards) may not be eligible for return due to hygiene and
            safety reasons.
          </li>
        </ul>
      </section>

      {/* ✅ Section 3 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Return Process</h2>
        <p>To initiate a return, please follow these steps:</p>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>
            Contact our support team at{" "}
            <a
              href="mailto:thesgrgroup1@gmail.com"
              className="text-blue-600 underline"
            >
              thesgrgroup1@gmail.com
            </a>{" "}
            or call <strong>+92-346-5611273</strong> within 7 days of delivery.
          </li>
          <li>
            Our team will verify your request and provide{" "}
            <strong>return instructions</strong>.
          </li>
          <li>
            Once the item is received and inspected, we will process your refund
            or exchange.
          </li>
        </ol>
      </section>

      {/* ✅ Section 4 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Refund Method</h2>
        <p>
          Refunds are issued using the{" "}
          <strong>original payment method</strong> selected during checkout:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Bank transfer (for online banking payments)</li>
          <li>Refund to Easypaisa, JazzCash, or Stripe</li>
          <li>Cash refund for Cash on Delivery (COD) orders</li>
        </ul>
        <p className="mt-2">
          Refunds may take <strong>5–10 working days</strong> depending on your
          bank or payment provider.
        </p>
      </section>

      {/* ✅ Section 6 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Non-Returnable Items</h2>
        <p>
          For hygiene and safety reasons, the following items cannot be returned
          or refunded unless they arrived damaged or defective:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Opened skincare, haircare, or cosmetic products</li>
          <li>Gift cards or vouchers</li>
          <li>Promotional or clearance items</li>
        </ul>
      </section>

      {/* ✅ Section 7 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p>
          For return or refund inquiries, please reach out to our support team:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:thesgrgroup1@gmail.com"
              className="text-blue-600 underline"
            >
              thesgrgroup1@gmail.com
            </a>
          </li>
          <li>
            <strong>Phone:</strong> +92-346-5611273
          </li>
          <li>
            <strong>Address:</strong> Mandi Bahauddin, Punjab, Pakistan
          </li>
        </ul>
      </section>
    </main>
  );
}
