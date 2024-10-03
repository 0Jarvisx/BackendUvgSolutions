const Product = require("../models/Product");

const { v4: uuidv4 } = require("uuid");

exports.createProduct = async (req, res) => {
  const { name, categoryId, stock, price, description, image } = req.body;


  try {
    const product = await Product.create({
      name,
      category_id: categoryId,
      stock,
      price,
      description,
      image,
    });

    res.json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  const file = req.file;
  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;
  res.json({
    message: "File uploaded successfully",
    file: {
      location: fileUrl,
      key: file.key,
      size: file.size,
      mimetype: file.mimetype,
    },
  });
};

// Leer todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Leer un solo producto
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
