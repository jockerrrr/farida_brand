const { Resend } = require("resend");
const Admin = require("../models/Admin");
const Order = require("../models/order");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderEmail = async (order) => {
  const populatedOrder = await Order.findById(order._id)
    .populate("Customer")
    .populate("items.product");

  const admins = await Admin.find();
  const adminEmails = admins.map((admin) => admin.email);

  // email to admins
  if (adminEmails.length > 0) {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: adminEmails,
      subject: "🛍️ New Order Received - The Duo",
      html: `
        <h2>New Order Received</h2>
        
        <h3>📦 Order Info</h3>
        <p><strong>Order Number:</strong> ${populatedOrder.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(populatedOrder.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> ${populatedOrder.status}</p>

        <h3>👤 Customer Info</h3>
        <p><strong>Name:</strong> ${populatedOrder.Customer.Firstname} ${populatedOrder.Customer.Lastname}</p>
        <p><strong>Email:</strong> ${populatedOrder.Customer.email}</p>
        <p><strong>Phone:</strong> ${populatedOrder.Customer.Phone}</p>
        <p><strong>Address:</strong> ${populatedOrder.Customer.Address}</p>
        <p><strong>City:</strong> ${populatedOrder.Customer.city}</p>
        ${populatedOrder.Customer.Apartment_suite_etc ? `<p><strong>Apartment:</strong> ${populatedOrder.Customer.Apartment_suite_etc}</p>` : ""}

        <h3>🛍️ Items</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead style="background-color: #f2f2f2;">
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price per item</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${populatedOrder.items
              .map(
                (item) => `
              <tr>
                <td>${item.product.Product_name}</td>
                <td>${item.size}</td>
                <td>${item.quantity}</td>
                <td>${item.price_at_purchase} EGP</td>
                <td>${item.price_at_purchase * item.quantity} EGP</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <h3>💰 Pricing</h3>
        <p><strong>Subtotal:</strong> ${populatedOrder.totalPrice - populatedOrder.shippingPrice} EGP</p>
        ${populatedOrder.discount ? `<p><strong>Discount Code:</strong> ${populatedOrder.discount}</p>` : ""}
        <p><strong>Shipping:</strong> ${populatedOrder.shippingPrice} EGP</p>
        <p style="font-size: 1.2rem;"><strong>Total Price:</strong> ${populatedOrder.totalPrice} EGP</p>
      `,
    });
    console.log("Order email sent to admins ✓");
  }

  // confirmation email to customer
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: populatedOrder.Customer.email,
    subject: "✅ Order Confirmed - The Duo",
    html: `
      <h2>Thank you for your order!</h2>
      <p>Hi ${populatedOrder.Customer.Firstname}, your order has been received and is being processed.</p>
      
      <h3>📦 Order Info</h3>
      <p><strong>Order Number:</strong> ${populatedOrder.order_number}</p>
      <p><strong>Order Date:</strong> ${new Date(populatedOrder.createdAt).toLocaleString()}</p>

      <h3>🛍️ Items</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price per item</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${populatedOrder.items
            .map(
              (item) => `
            <tr>
              <td>${item.product.Product_name}</td>
              <td>${item.size}</td>
              <td>${item.quantity}</td>
              <td>${item.price_at_purchase} EGP</td>
              <td>${item.price_at_purchase * item.quantity} EGP</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <h3>💰 Pricing</h3>
      <p><strong>Subtotal:</strong> ${populatedOrder.totalPrice - populatedOrder.shippingPrice} EGP</p>
      ${populatedOrder.discount ? `<p><strong>Discount Code:</strong> ${populatedOrder.discount}</p>` : ""}
      <p><strong>Shipping:</strong> ${populatedOrder.shippingPrice} EGP</p>
      <p style="font-size: 1.2rem;"><strong>Total Price:</strong> ${populatedOrder.totalPrice} EGP</p>

      <br/>
      <p>We will contact you soon to confirm your delivery details.</p>
      <p>Thank you for shopping with <strong>The Duo</strong> 🖤</p>
    `,
  });
  console.log("Order confirmation email sent to customer ✓");
};

const sendReturnEmail = async (order,Phone,returnItems) => {
  const populatedOrder = await Order.findById(order._id)
    .populate("Customer")
    .populate("items.product");

  if (!populatedOrder) return;

  const admins = await Admin.find();
  const adminEmails = admins.map((admin) => admin.email);

  if (adminEmails.length === 0) return;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: adminEmails,
    subject: "🔄 Return Request - The Duo",
    html: `
      <h2>Return Request Received</h2>
      
      <h3>📦 Order Info</h3>
      <p><strong>Order Number:</strong> ${populatedOrder.order_number}</p>
      <p><strong>Order Date:</strong> ${new Date(populatedOrder.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> ${populatedOrder.status}</p>

      <h3>👤 Customer Info</h3>
      <p><strong>Name:</strong> ${populatedOrder.Customer.Firstname} ${populatedOrder.Customer.Lastname}</p>
      <p><strong>Email:</strong> ${populatedOrder.Customer.email}</p>
      <p><strong>Phone:</strong> ${Phone}</p>
      <p><strong>Address:</strong> ${populatedOrder.Customer.Address}</p>
      <p><strong>City:</strong> ${populatedOrder.Customer.city}</p>
      ${populatedOrder.Customer.Apartment_suite_etc ? `<p><strong>Apartment:</strong> ${populatedOrder.Customer.Apartment_suite_etc}</p>` : ""}

      <h3>🔄 Items to Return/Adjust</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th>Product</th>
            <th>Original Size</th>
            <th>New Size</th>
            <th>Original Quantity</th>
            <th>New Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${returnItems.map((item) => {
            const originalItem = populatedOrder.items.find(i => i._id.toString() === item.item_id);
            return `
              <tr>
                <td>${originalItem ? originalItem.product.Product_name : item.item_id}</td>
                <td>${originalItem ? originalItem.size : "-"}</td>
                <td>${item.new_size || originalItem?.size || "-"}</td>
                <td>${originalItem ? originalItem.quantity : "-"}</td>
                <td>${item.new_quantity ?? originalItem?.quantity ?? "-"}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `,
  });
  console.log("Return email sent to admins ✓");
};

module.exports = { sendOrderEmail, sendReturnEmail };
