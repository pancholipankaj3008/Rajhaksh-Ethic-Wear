require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../Config/dbConfig");
const Product = require("../Models/Product");
const Enquiry = require("../Models/Enquiry");

async function run() {
  await connectDB();
  const [products, enquiries] = await Promise.all([
    Product.collection.updateMany({ colors: { $exists: true } }, { $unset: { colors: "" } }),
    Enquiry.collection.updateMany({ "items.selection.color": { $exists: true } }, { $unset: { "items.$[].selection.color": "" } }),
  ]);
  console.log(`Removed legacy color data from ${products.modifiedCount} product(s) and ${enquiries.modifiedCount} enquiry record(s).`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("Could not remove legacy color data:", error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
