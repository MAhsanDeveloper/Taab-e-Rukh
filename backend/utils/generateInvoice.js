import PDFDocument from "pdfkit";

export const generateInvoice = (order, stream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(stream);

  // ======= HEADER =======
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("Taab e Rukh", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(16)
    .font("Helvetica")
    .text("Invoice", { align: "center" })
    .moveDown(1);

  // ======= CUSTOMER INFO =======
  const shipping = order.shippingDetails || {};
  const customerName = shipping.fullName || "Guest";
  const customerEmail = shipping.email || "N/A";
  const customerPhone = shipping.phone || "-";
  const customerAddress =
    shipping.address && shipping.city
      ? `${shipping.address}, ${shipping.city}`
      : "N/A";

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`Order ID: ${order._id}`)
    .text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
    .text(`Name: ${customerName}`)
    .text(`Phone: ${customerPhone}`)
    .text(`Email: ${customerEmail}`)
    .text(`Address: ${customerAddress}`)
    .text(`Payment Method: ${order.paymentMethod || "N/A"}`)
    .moveDown();

  // ======= TABLE HEADER =======
  const tableTop = doc.y;
  const itemX = 50;
  const qtyX = 280;
  const priceX = 340;
  const subtotalX = 420;

  doc
    .font("Helvetica-Bold")
    .text("Item", itemX, tableTop)
    .text("Qty", qtyX, tableTop)
    .text("Price", priceX, tableTop)
    .text("Subtotal", subtotalX, tableTop);

  doc
    .moveTo(itemX, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke()
    .moveDown(0.5);

  // ======= TABLE BODY =======
  let positionY = tableTop + 25;
  doc.font("Helvetica");

  const products = order.products || [];
  products.forEach((item) => {
    // Get name from product object or fallback
    const name = item.product?.name || "Unnamed product";

    const quantity = item.quantity || 0;

    // FIX: price should come from item.product.price (not item.price)
    const price = item.price ?? item.product?.price ?? 0;

    doc
      .text(name, itemX, positionY)
      .text(String(quantity), qtyX, positionY)
      .text(`Rs. ${price}`, priceX, positionY)
      .text(`Rs. ${price * quantity}`, subtotalX, positionY);

    positionY += 30;
  });

  // ======= TOTAL =======
  doc
    .moveTo(itemX, positionY + 10)
    .lineTo(550, positionY + 10)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(`Total: Rs. ${order.totalAmount || 0}`, subtotalX, positionY + 20, {
      align: "right",
    });

  // ======= FOOTER =======
  doc
    .moveDown(4)
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text("Thank you for shopping at Taab e Rukh!", {
      align: "center",
    });

  doc.end();
};
