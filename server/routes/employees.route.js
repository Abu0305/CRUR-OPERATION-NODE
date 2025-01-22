import express from "express";
import {
  employeeAdd,
  employeeDelete,
  employeeDetails,
  employeeEdit,
  employeeEditById,
  employeeView,
  fileUpload,
} from "../controllers/employees.controller.js";

const router = express.Router();

// Creating Employee

router.post("/", employeeAdd);

// File upload

router.post("/:id", fileUpload);

// Read Employee

router.get("/", employeeView);

// Read Employee

router.get("/:id", employeeDetails);

// Update Employee

router.put("/:id", employeeEdit);

// Update address By Id

router.patch("/:id/:id1", employeeEditById);

// Delete Employee

router.delete("/:id", employeeDelete);

export default router;
