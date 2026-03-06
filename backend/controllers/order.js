const order_db = require("../models/order");
const { sendOrderEmail, sendReturnEmail } = require("../Utils/sendOrderEmail");

const getall = async (req, res) => {
  try {
    const orders = await order_db.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create_order = async (req, res) => {
  try {
    const newOrder = new order_db(req.body);
    await newOrder.save();
    try {
      await sendOrderEmail(newOrder);
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }
    res.status(201).json({ message: "order created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const update_order = async (req, res) => {
  try {
    const order = await order_db.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "order not found" });

    Object.assign(order, req.body);
    await order.save(); // this triggers the pre('save') hook

    res.status(200).json({ message: "order updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const delete_order = async (req, res) => {
  try {
    const doc = await order_db.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "order not found" });
    }
    res.status(200).json({ message: "order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_byID = async (req, res) => {
  try {
    const order = await order_db.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOrder =async (req, res) => {
  try {
    const { order_number } = req.body;
    if (!order_number) {
      return res.status(404).json({ message: "Enter order numbers" });
    }
    const order =await order_db.findOne({ order_number: order_number });
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({
          message: `order cannot be returned, current status: ${order.status}`,
        });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const returnPolicy = async (req, res) => {
  try {
    const { order_number, phone_number, items } = req.body;
    if (!order_number || !phone_number || !items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "order number, phone number and items are required" });
    }
    const order =await order_db
      .findOne({ order_number: order_number })
      .populate("Customer")
      .populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    try {
      await sendReturnEmail(order,phone_number,items);
    } catch (emailError) {
      console.error("Return email failed:", emailError.message);
    }
    res.status(200).json({ message: "Return request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getall,
  create_order,
  update_order,
  delete_order,
  get_byID,
  returnPolicy,
  verifyOrder,
};
