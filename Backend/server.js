const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { protect } = require("./middleware/authMiddleware");
const connectDB = require("./Config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");

require('dotenv').config();

const app = express();


app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Disabled for development

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Pickzy API!");
});


// API Routes
app.use("/api/users", protect, userRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/cart", cartRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/subscriber", subscriberRoutes); 

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
