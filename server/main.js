import express from "express";
import employeeRoutes from "./routes/employees.route.js";
import connectDB from "./lib/db.js";

const app = express();
const PORT = 6969;

// Data understanding middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Connect DB

connectDB();

app.get("/", (req, res) => {
  res.json({ msg: "Hello Developers!" });
});

app.use("/employee", employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
