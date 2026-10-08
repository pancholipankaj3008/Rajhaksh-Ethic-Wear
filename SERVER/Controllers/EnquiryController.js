const mongoose = require("mongoose");
const Enquiry = require("../Models/Enquiry");
const Product = require("../Models/Product");

const STATUS_VALUES = ["pending", "contacted", "completed", "cancelled"];
const clean = (value) => String(value || "").trim();
const normalize = (value) => clean(value).toLowerCase();

function validateContactDetails(data) {
  if (![data.customerName, data.phone, data.email, data.city].every(clean)) return "Name, phone, email and city are required";
  if (!/^\S+@\S+\.\S+$/.test(data.email)) return "A valid email is required";
  return null;
}

function validateProductSelection(product, item) {
  const size = clean(item.size);
  if (size && !product.sizes.some((value) => normalize(value) === normalize(size))) return "Selected size is unavailable";

  return null;
}

async function buildEnquiryItems(items) {
  const preparedItems = [];

  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.productId) || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
      throw new Error("Each enquiry item needs a valid product and quantity");
    }

    const product = await Product.findOne({ _id: item.productId, isActive: true });
    if (!product) throw new Error("An enquiry product is no longer available");

    const selectionError = validateProductSelection(product, item);
    if (selectionError) throw new Error(`${selectionError} for ${product.title}`);

    preparedItems.push({
      product: product._id,
      selection: { size: clean(item.size), sku: product.sku },
      quantity: Number(item.quantity),
      productSnapshot: {
        title: product.title,
        image: product.images[0] || "",
        wholesalePrice: product.wholesalePrice,
      },
    });
  }

  return preparedItems;
}

async function CreateEnquiry(req, res) {
  try {
    const contact = {
      customerName: clean(req.body.customerName),
      businessName: clean(req.body.businessName),
      phone: clean(req.body.phone),
      email: clean(req.body.email).toLowerCase(),
      city: clean(req.body.city),
      message: clean(req.body.message),
    };

    const contactError = validateContactDetails(contact);
    if (contactError) return res.status(400).json({ success: false, message: contactError });
    if (!Array.isArray(req.body.items) || !req.body.items.length) return res.status(400).json({ success: false, message: "Add at least one product to the enquiry" });

    const items = await buildEnquiryItems(req.body.items);
    const enquiry = await Enquiry.create({ ...contact, customer: req.id || null, items });

    return res.status(201).json({ success: true, message: "Wholesale enquiry submitted successfully", enquiry });
  } catch (error) {
    const knownError = /valid product|unavailable/.test(error.message);
    return res.status(knownError ? 400 : 500).json({ success: false, message: knownError ? error.message : "Unable to submit enquiry" });
  }
}

async function GetEnquiries(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = req.query.status ? { status: req.query.status } : {};
    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Enquiry.countDocuments(filter),
    ]);

    return res.json({ success: true, enquiries, total, currentPage: page, totalPages: Math.ceil(total / limit) });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to fetch enquiries" });
  }
}

async function GetEnquiry(req, res) {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate("customer", "name email phone role").populate("items.product", "title images sku");
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
    return res.json({ success: true, enquiry });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid enquiry ID" });
  }
}

async function DeleteEnquiry(req, res) {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  return enquiry ? res.json({ success: true, message: "Enquiry deleted successfully" }) : res.status(404).json({ success: false, message: "Enquiry not found" });
}

async function UpdateEnquiry(req, res) {
  if (!STATUS_VALUES.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid enquiry status" });
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  return enquiry ? res.json({ success: true, message: "Enquiry status updated", enquiry }) : res.status(404).json({ success: false, message: "Enquiry not found" });
}

module.exports = { CreateEnquiry, GetEnquiries, GetEnquiry, UpdateEnquiry, DeleteEnquiry };
