const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { protect } = require("./middleware/authMiddleware");
const connectDB = require("./Config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Pickzy API!");
});

//API Routes (protected)
app.use("/api/users", protect, userRoutes);
app.use("/api/products", productRoutes); // public
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", protect, checkoutRoutes);
app.use("/api/orders", protect, orderRoutes);

// Purchase and profile routes (protected)
app.use("/api/purchases", purchaseRoutes);

// Admin Routes
// Only accessible by admin users
// app.use("/api/admin", protect, adminRoutes);
// app.use("/api/admin/products", protect, adminProductRoutes);
// app.use("/api/admin/orders", protect, adminOrderRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
