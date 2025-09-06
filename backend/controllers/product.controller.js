import Product from "../models/product.model.js";

// Create a new product
export async function createProductController(req, res) {
  try {
    const { title, description, category, price, image } = req.body;
    
    if (!title || !description || !category || !price) {
      return res.status(400).json({
        message: "Please provide title, description, category, and price",
        error: true,
        success: false,
      });
    }
    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(400).json({
        message: "A product with this title already exists",
        error: true,
        success: false,
      });
    }


    const product = new Product({
      owner: req.user._id,
      title,
      description,
      category,
      price,
      image: image || "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    });

    const savedProduct = await product.save();
    
    return res.status(201).json({
      message: "Product created successfully",
      error: false,
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get all productwithoptional filtering
export async function getProductsController(req, res) {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (category && category !== "All") {
      query.category = category;
    }
    
    const products = await Product.find(query)
      .populate("owner", "username")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    return res.json({
      message: "Products fetched successfully",
      error: false,
      success: true,
      data: products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get a single product
export async function getProductController(req, res) {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id).populate("owner", "username");
    
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }
    
    return res.json({
      message: "Product fetched successfully",
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Update a product
export async function updateProductController(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, price, image } = req.body;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }
    
    // Check if the user owns the product
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own products",
        error: true,
        success: false,
      });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, category, price, image },
      { new: true, runValidators: true }
    );
    
    return res.json({
      message: "Product updated successfully",
      error: false,
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// http://localhost:8080/api/products/delete/?id=68bbced8728b54e394e62598
// Delete a product
export async function deleteProductController(req, res) {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }
    
    // Check if the user owns the product
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own products",
        error: true,
        success: false,
      });
    }
    
    await Product.findByIdAndDelete(id);
    
    return res.json({
      message: "Product deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Search products
export async function searchProductsController(req, res) {
  try {
    const { q, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    
    if (category && category !== "All") {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(query)
      .populate("owner", "username")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    return res.json({
      message: "Products fetched successfully",
      error: false,
      success: true,
      data: products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}