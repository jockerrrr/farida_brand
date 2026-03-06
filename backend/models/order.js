const mongoose = require("mongoose");
const Product = require("./Product");
const discount = require("./Discounts");
const Settings = require("./Settings");

const order_schema = new mongoose.Schema(
  {
    order_number:{
      type:Number,
      unique:true
    },
    discount: {
      type: String,
      required: false,
      trim: true,
      uppercase: true,
    },
    Customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
          },
          size: {
            type: String,
            required: true,
          },
          price_at_purchase: {
            type: Number,
            validate: {
              validator: (v) => v > 0,
              message: "Price must be greater than 0",
            },
          },
        },
      ],
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must have at least one item",
      },
      required: true,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      validate: {
        validator: (v) => v > 0,
        message: "Total price must be greater than 0",
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

order_schema.pre("save", async function (next) {

  if (!this.order_number) {
    let isUnique = false;
    while (!isUnique) {
      const randomNum = Math.floor(1000000 + Math.random() * 9000000); // always 7 digits
      const existing = await mongoose.model("Order").findOne({ order_number: randomNum });
      if (!existing) {
        this.order_number = randomNum;
        isUnique = true;
      }
    }
  }
  // fetch product prices
  for (let item of this.items) {
    const product = await Product.findById(item.product);
    if (!product) return next(new Error(`Product ${item.product} not found`));
    item.price_at_purchase = product.Price;
  }

  // calculate subtotal
  const subtotal = this.items.reduce((total, item) => {
    return total + item.price_at_purchase * item.quantity;
  }, 0);

  // fetch shipping price from settings
  const shippingSetting = await Settings.findOne({ key: "shipping_price" });
  this.shippingPrice = shippingSetting ? shippingSetting.value : 100; // fallback to 100

  // apply discount if exists
  if (this.discount) {
    const discountDoc = await discount.findOne({
      code: this.discount,
      isActive: true,
    });
    if (discountDoc) {
      const discountAmount = (subtotal * discountDoc.percentage) / 100;
      this.totalPrice = subtotal - discountAmount + this.shippingPrice;
    } else {
      return next(
        new Error(`Discount code "${this.discount}" is invalid or inactive`)
      );
    }
  } else {
    this.totalPrice = subtotal + this.shippingPrice;
  }

  next();
});

module.exports = mongoose.model("Order", order_schema);
