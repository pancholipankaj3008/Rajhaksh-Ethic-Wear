require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../Models/Category");
const slugify = require("slugify");

const names = ["Kurtis", "Dresses", "Tops", "Co-ord Sets", "Sarees", "Bottom Wear", "Suits", "Ethnic Wear", "Western Wear"];
(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  for (const name of names) await Category.updateOne({ name }, { $setOnInsert: { name, slug: slugify(name, { lower: true, strict: true }), isActive: true } }, { upsert: true });
  await mongoose.disconnect();
  console.log("Wholesale categories seeded");
})().catch((error) => { console.error(error); process.exit(1); });
