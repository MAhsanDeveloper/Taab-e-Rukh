import axios from "axios";

export const sendOrderConfirmation = async (order, user) => {
  try {
 const productRows = order.products
  .map((p) => {
    const price = p.price; // original price
    const discountedPrice = p.discountedPrice || price; // use discounted price
    const quantity = p.quantity;
    const total = discountedPrice * quantity;

    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.product.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align:center;">${quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align:right;">
          Rs ${price} ${price !== discountedPrice ? `<br/><span style="color: green;">Discounted: Rs ${discountedPrice.toFixed(2)}</span>` : ""}
        </td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align:right;">Rs ${total.toFixed(2)}</td>
      </tr>
    `;
  })
  .join("");


    const shippingCost = order.shippingCost || 0;
    const couponText = order.couponCode
      ? `<p><strong>Coupon (${order.couponCode}) applied:</strong> -${order.couponDiscount || 0}%</p>`
      : "";

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
                <th style="padding: 10px; border: 1px solid #ddd; text-align:left;">Product</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align:center;">Qty</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align:right;">Price (PKR)</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align:right;">Total (PKR)</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>

          ${couponText}
          <p><strong>Shipping:</strong> Rs ${shippingCost}</p>
          <p><strong>Total Amount:</strong> Rs ${order.totalAmount}</p>
          <p><strong>Contact:</strong> ${order.shippingDetails.phone} / ${user.email}</p>
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

