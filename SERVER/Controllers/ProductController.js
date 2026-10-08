const mongoose = require("mongoose");
const cloudinary = require("../Config/cloudinaryConfig");
const Product = require("../Models/Product");

const MAX_PAGE_SIZE = 100;

function parseArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value.split(",");
  }
}

function cleanString(value) {
  return String(value || "").trim();
}

function cleanStringArray(value) {
  return [...new Set(parseArray(value).map(cleanString).filter(Boolean))];
}

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return value === true || String(value).toLowerCase() === "true";
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parsePrice(value) {
  if (value === undefined || value === null || value === "") return null;
  const price = Number(value);
  return Number.isFinite(price) ? price : null;
}

function getPagination(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "raj-haksh/products", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result.secure_url))
    );

    stream.end(buffer);
  });
}

async function uploadProductImages(files = []) {
  const imageFiles = files.filter((file) => file.fieldname === "images");
  return Promise.all(imageFiles.map((file) => uploadImage(file.buffer)));
}

function buildProductData(body) {
  return {
    title: cleanString(body.title),
    description: cleanString(body.description),
    category: cleanString(body.category),
    wholesalePrice: parsePrice(body.wholesalePrice),
    sizes: cleanStringArray(body.sizes),
    sku: cleanString(body.sku),
    isFeatured: parseBoolean(body.isFeatured),
    isNewArrival: parseBoolean(body.isNewArrival),
    isActive: parseBoolean(body.isActive, true),
  };
}

function validateProduct(data) {
  if (!data.title || !data.category) return "Title and category are required";
  if (data.wholesalePrice === null || data.wholesalePrice < 0) return "A valid wholesale price is required";
  if (!data.sku) return "SKU is required";
  return null;
}

function sendProductError(res, error, fallbackMessage) {
  console.error(fallbackMessage, error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: Object.values(error.errors)[0]?.message || "Product validation failed" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "SKU already exists" });
  }

  if (error.http_code || error.name === "Error" && /cloudinary|upload/i.test(error.message || "")) {
    return res.status(502).json({ success: false, message: "Image upload failed. Please verify your Cloudinary configuration and try again." });
  }

  return res.status(500).json({ success: false, message: fallbackMessage });
}

function buildProductQuery(query, includeInactive = false) {
  const filter = includeInactive ? {} : { isActive: true };

  if (query.search) {
    const keyword = escapeRegex(query.search.trim());
    filter.$or = ["title", "description", "category", "sku"].map((field) => ({
      [field]: { $regex: keyword, $options: "i" },
    }));
  }

  if (query.category) filter.category = query.category;
  if (query.size) filter.sizes = { $regex: `^${escapeRegex(query.size)}$`, $options: "i" };
  if (query.isFeatured !== undefined) filter.isFeatured = parseBoolean(query.isFeatured);

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.wholesalePrice = {};
    if (query.minPrice !== undefined) filter.wholesalePrice.$gte = Number(query.minPrice);
    if (query.maxPrice !== undefined) filter.wholesalePrice.$lte = Number(query.maxPrice);
  }

  return filter;
}

function getSortOption(sort) {
  const options = {
    lowToHigh: { wholesalePrice: 1 },
    highToLow: { wholesalePrice: -1 },
    newest: { createdAt: -1 },
  };

  return options[sort] || options.newest;
}

async function AddProduct(req, res) {
  try {
    const data = buildProductData(req.body);
    const validationError = validateProduct(data);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (await Product.exists({ sku: data.sku })) {
      return res.status(409).json({ success: false, message: "SKU already exists" });
    }

    data.images = await uploadProductImages(req.files || []);
    if (!data.images.length) {
      return res.status(400).json({ success: false, message: "At least one product image is required" });
    }

    const product = await Product.create(data);

    return res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (error) { return sendProductError(res, error, "Unable to create product"); }
}

async function GetAllProducts(req, res) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildProductQuery(req.query, req.role === "admin" && req.query.includeInactive === "true");

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).sort(getSortOption(req.query.sort)).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch products" });
  }
}

async function GetSingleProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findOne({ _id: id, isActive: true });

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, product });
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch product" });
  }
}

async function UpdateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const data = buildProductData({ ...product.toObject(), ...req.body });
    const validationError = validateProduct(data);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const skuOwner = await Product.findOne({ sku: data.sku, _id: { $ne: product._id } });
    if (skuOwner) return res.status(409).json({ success: false, message: "SKU already exists" });

    const newImages = await uploadProductImages(req.files || []);
    data.images = newImages.length ? [...product.images, ...newImages] : product.images;
    Object.assign(product, data);
    await product.save();
    await Product.collection.updateOne({ _id: product._id }, { $unset: { colors: "" } });

    return res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) { return sendProductError(res, error, "Unable to update product"); }
}

async function DeleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.isActive = false;
    await product.save();

    return res.json({ success: true, message: "Product deactivated successfully" });
  } catch (error) {
    console.error("Deactivate product error:", error);
    return res.status(500).json({ success: false, message: "Unable to deactivate product" });
  }
}

function getFlaggedProducts(field) {
  return async (req, res) => {
    try {
      const products = await Product.find({ isActive: true, [field]: true }).sort({ createdAt: -1 }).limit(20);
      return res.json({ success: true, products });
    } catch (error) {
      console.error(`Get ${field} products error:`, error);
      return res.status(500).json({ success: false, message: "Unable to fetch products" });
    }
  };
}

async function RelatedProducts(req, res) {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) return res.status(404).json({ success: false, message: "Product not found" });

    const products = await Product.find({
      _id: { $ne: currentProduct._id },
      category: currentProduct.category,
      isActive: true,
    }).sort({ createdAt: -1 }).limit(8);

    return res.json({ success: true, products });
  } catch (error) {
    console.error("Get related products error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch related products" });
  }
}

async function ProductAnalytics(req, res) {
  try {
    const [totalProducts, activeProducts, featuredProducts, newArrivalProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, isFeatured: true }),
      Product.countDocuments({ isActive: true, isNewArrival: true }),
    ]);

    return res.json({ success: true, analytics: { totalProducts, activeProducts, featuredProducts, newArrivalProducts } });
  } catch (error) {
    console.error("Product analytics error:", error);
    return res.status(500).json({ success: false, message: "Unable to load product analytics" });
  }
}

module.exports = {
  AddProduct,
  GetAllProducts,
  GetSingleProduct,
  UpdateProduct,
  DeleteProduct,
  FeaturedProducts: getFlaggedProducts("isFeatured"),
  NewArrivals: getFlaggedProducts("isNewArrival"),
  RelatedProducts,
  ProductAnalytics,
};
