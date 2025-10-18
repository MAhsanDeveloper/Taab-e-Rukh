import PDFDocument from "pdfkit";

export const generatePackagingSlip = (order, stream) => {
  const doc = new PDFDocument({ margin: 40 });

  doc.pipe(stream);

  // ======= HEADER =======
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Taab e Rukh", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Dispatch Package Slip", { align: "center" })
    .moveDown(1.5);

  // ======= RECEIVER INFO =======
  const shipping = order.shippingDetails || {};
  const customerName = shipping.fullName || "Guest";
  const customerEmail = shipping.email || "N/A";
  const customerPhone = shipping.phone || "-";
  const customerAddress = shipping.address && shipping.city
    ? `${shipping.address}, ${shipping.city}`
    : "N/A";

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Shipping Info:", { underline: true })
    .moveDown(0.5);

  doc
    .font("Helvetica")
    .text(`Receiver: ${customerName} | Phone: ${customerPhone}`)
    .moveDown(0.2)
    .text(`Email: ${customerEmail}`)
    .moveDown(0.2)
    .text(`Address: ${customerAddress}`)
    .moveDown(1.5);

  // ======= PRODUCTS =======
  doc
    .font("Helvetica-Bold")
    .text("Total Price", { underline: true })
    .moveDown(0.5);

  let totalPrice = 0;

  order.products.forEach((p) => {
    const name = p.product.name || "Unnamed Product";
    const qty = p.quantity || 1;
    const price = p.product.price || 0;
    const lineTotal = price * qty;
    totalPrice += lineTotal;

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(`${name} (${qty}) - Rs. ${lineTotal.toFixed(2)}`);
  });

  doc
    .moveDown(0.5)
    .font("Helvetica-Bold")
    .text(`Overall Total: Rs. ${totalPrice.toFixed(2)}`)
    .moveDown(2);

  // ======= FOOTER =======
  doc
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text("Please handle with care.", { align: "center" });

  doc.end();
};
