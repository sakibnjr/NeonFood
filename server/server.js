require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const foodRoutes = require("./routes/food");
const orderRoutes = require("./routes/order");
const reviewRoutes = require("./routes/reviews");
const settingsRoutes = require("./routes/settings");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => res.send("NeonFood API running!"));

// TODO: Add your routes here
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes); // Authentication and admin management
app.use("/api/admin/settings", settingsRoutes); // Admin settings routes

const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
