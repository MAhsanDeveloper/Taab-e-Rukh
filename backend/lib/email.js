import axios from "axios";

export const sendOrderConfirmation = async (order, user) => {
  try {
    // Generate product rows
    const productRows = order.products
      .map((p) => {
        const quantity = p.quantity;
        const total = p.discountedPrice * quantity;

        return `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${p.product.name}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right;">
              Rs ${p.price.toFixed(2)} ${
                p.price !== p.discountedPrice
                  ? `<br/><span style="color:green;">Discounted: Rs ${p.discountedPrice.toFixed(2)}</span>`
                  : ""
              }
            </td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right;">Rs ${total.toFixed(2)}</td>
          </tr>
        `;
      })
      .join("");

    // Calculate subtotal
    const subtotal = order.products.reduce(
      (acc, p) => acc + p.discountedPrice * p.quantity,
      0
    );

    const couponText = order.couponCode
      ? `<p><strong>Coupon (${order.couponCode}) applied:</strong> -${order.couponDiscount || 0}%</p>`
      : "";

    // Apply coupon discount
    const totalAfterCoupon = order.couponDiscount
      ? subtotal - (subtotal * order.couponDiscount) / 100
      : subtotal;

    const shippingCost = order.shippingCost || 0;
    const finalTotal = totalAfterCoupon + shippingCost;
    const savings = order.products.reduce(
      (acc, p) => acc + (p.price - p.discountedPrice) * p.quantity,
      0
    );

    const emailData = {
      sender: { email: "info@thesgrgroup.com", name: "The SGR Group" },
      to: [{ email: user.email, name: user.name }],
      subject: "Order Confirmation: Your order has been placed successfully! 🎉",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2a9d8f;">Hello ${user.name},</h2>
          <p>Thank you for your order! Here are the details:</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f4f4f4;">
                <th style="padding:10px;border:1px solid #ddd;text-align:left;">Product</th>
                <th style="padding:10px;border:1px solid #ddd;text-align:center;">Qty</th>
                <th style="padding:10px;border:1px solid #ddd;text-align:right;">Price (PKR)</th>
                <th style="padding:10px;border:1px solid #ddd;text-align:right;">Total (PKR)</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>

          <p><strong>Subtotal:</strong> Rs ${subtotal.toFixed(2)}</p>
          ${savings > 0 ? `<p style="color:green;"><strong>Savings:</strong> Rs ${savings.toFixed(2)}</p>` : ""}
          ${couponText}
          <p><strong>Shipping:</strong> Rs ${shippingCost.toFixed(2)}</p>
          <p><strong>Total Amount:</strong> Rs ${finalTotal.toFixed(2)}</p>
          <p><strong>Contact:</strong> ${order.shippingDetails.phone || "N/A"} / ${user.email}</p>
          <p>Your order will be delivered within 3-5 business days.</p>

          <p style="margin-top: 20px;">Thank you for shopping with <strong>The SGR Group</strong>!</p>
          <hr style="margin-top: 30px; border:none; border-top:1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">If you have any questions, please reply to this email or contact us at <a href="mailto:thesgrgroup1@gmail.com">thesgrgroup1@gmail.com</a>.</p>
        </div>
      `,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        "api-key": process.env.SENDINBLUE_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Order confirmation email sent!");
  } catch (err) {
    console.error(
      "Failed to send order confirmation:",
      err.response?.data || err.message
    );
  }
};
