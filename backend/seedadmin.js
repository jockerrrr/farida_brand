const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DBURL);

    const existingAdmin = await Admin.findOne({ email: "abdallahgalal2003@gmail.com" });
    if (existingAdmin) {
      console.log("Seed admin already exists");
      process.exit(0);
    }

    const admin = new Admin({
      name: "Abdallah",
      email: "abdallahgalal2003@gmail.com",
      password: 'Abdallah1',
      Phone_number: "01009550276",
    });

    await admin.save();
    console.log("Seed admin created successfully ✓");
    process.exit(0);
  } catch (error) {
    console.error("Error creating seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();