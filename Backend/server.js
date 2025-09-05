const express = require("express");
const http = require("http");
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
const subscriberRoutes = require("./routes/subscriberRoutes");
const path = require('path');

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const PORT = process.env.PORT || 3001;    

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Pickzy API (HTTP + HTTPS)!");
});

// API Routes
app.use("/api/users", protect, userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/subscriber", subscriberRoutes);

// SSL Certificate paths
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../crt/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '../crt/localhost.crt'))
};

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(PORT, () => {
    console.log(`🔒 HTTPS Server running on https://localhost:${PORT}`);
});


