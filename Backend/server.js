const express = require("express");
const cors = require("cors");
//const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
//const adminRoutes = require("./routes/adminRoutes");
// const adminProductRoutes = require("./routes/adminProductRoutes");
// const adminOrderRoutes = require("./routes/adminOrderRoutes");  

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());


//console.log("Cloudinary: " + process.env.CLOUDINARY_API_SECRET);

//console.log("Mongo_URL: " + process.env.MONGO_URL);
//console.log("Port: " + process.env.PORT);
//console.log("JWT_SECRET: " + process.env.JWT_SECRET); 

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Pickzy API!");
});

//API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscriber", subscriberRoutes);

// Admin Routes
// Only accessible by admin users
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin/products", adminProductRoutes);
// app.use("/api/admin/orders", adminOrderRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
