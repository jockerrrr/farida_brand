const product_db = require("../models/Product");

const getall = async (req, res) => {
  try {
    const products = await product_db.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create_product = async (req, res) => {
  try {
    const newProduct = new product_db(req.body);
    await newProduct.save();
    res.status(201).json({ message: "product created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const update_product = async (req, res) => {
  try {
    const updateProduct = await product_db.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updateProduct) return res.status(404).json({ message: "product not found" });
    res.status(200).json({ message: "product updated", updateProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const delete_prod = async (req, res) => {
  try {
    const doc = await product_db.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "product not found" });
    res.status(200).json({ message: "product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_byID = async (req, res) => {
  try {
    const product = await product_db.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upload_images = async (req, res) => {
  try {
    const urls = req.files.map(file => file.path);
    
    const product = await product_db.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: urls } } }, // adds URLs to the images array
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "product not found" });

    res.status(200).json({ message: "images uploaded", images: product.images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getall, create_product, update_product, delete_prod, get_byID , upload_images};