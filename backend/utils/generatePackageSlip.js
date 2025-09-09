import PDFDocument from "pdfkit";

export const generatePackagingSlip = (order, stream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(stream);

  // ======= HEADER =======
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Taab e Rukh", { align: "center" })
    .moveDown(1);

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Dispatch Invoice", { align: "center" })
    .moveDown(2);

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
    .font("Helvetica")
    .text(`Receiver: ${customerName}`)
    .moveDown(0.5)
    .text(`Phone: ${customerPhone}`)
    .moveDown(0.5)
    .text(`Email: ${customerEmail}`)
    .moveDown(0.5)
    .text("Shipping Address:")
    .text(customerAddress, { indent: 20 })
    .moveDown(2);

  // ======= FOOTER =======
  doc
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text("Please handle with care.", { align: "center" });

  doc.end();
};
