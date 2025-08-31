const express = require("express");
const https = require("https");
const fs = require("fs");
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


if (process.env.NODE_ENV === "production") {
  // Read SSL certificate files
  const privateKey = fs.readFileSync("privkey.pem", "utf8");
  const certificate = fs.readFileSync("fullchain.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };
  https.createServer(credentials, app).listen(PORT, () => {
    console.log(`HTTPS Server is running on https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP Server is running on http://localhost:${PORT}`);
  });
}
