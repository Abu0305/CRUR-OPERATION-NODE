import { employee } from "../models/employee.model.js";
import bcrypt from "bcrypt";
// import path from "path";
// import multer from "multer";
import upload from "../middleware/upload.js";

export const employeeAdd = async (req, res) => {
  //validate the data
  const hash = await bcrypt.hash(req.body.password, 10);
  const newEmployee = new employee({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    phone: req.body.phone,
    address: {
      city: req.body.address.city,
      state: req.body.address.state,
      pincode: req.body.address.pincode,
    },
    file: req.body.file,
  });

  try {
    const emp = await newEmployee.save();
    return res.status(201).json(emp);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Employee get

export const employeeView = async (req, res) => {
  try {
    const employees = await employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employee update

export const employeeDetails = async (req, res) => {
  try {
    const empUpdate = await employee.findById(req.params.id);

    if (empUpdate == null) {
      return res.status(404).json({ message: "Cannot Fine Employee" });
    } else {
      res.json(empUpdate);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Employee update

export const employeeEdit = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const result = await employee.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        phone: req.body.phone,
        $push: {
          address: {
            city: req.body.address.city,
            state: req.body.address.state,
            pincode: req.body.address.pincode,
          },
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Employee delete

export const employeeDelete = async (req, res) => {
  const empId = req.params.id;

  try {
    await employee.deleteOne({ _id: empId });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const employeeEditById = async (req, res) => {
  const empID = await employee.findById(req.params.id);
  if (!empID) {
    res.status(400).json({ message: "Employee Not Found" });
  }
  try {
    let temp = 0;
    for (let i = 0; i < empID.address.length; i++) {
      if (empID.address[i]["_id"].toString() == req.params.id1) {
        temp = 1;
        await employee.updateOne(
          { _id: req.params.id },
          {
            $pull: {
              address: {
                city: req.body.address.city,
                state: req.body.address.state,
                pincode: req.body.address.pincode,
              },
            },
          }
        );
        const editEmployee = await employee.updateOne(
          { _id: req.params.id },
          {
            $push: {
              address: {
                city: req.body.address.city,
                state: req.body.address.state,
                pincode: req.body.address.pincode,
              },
            },
          },
          {
            new: true,
          }
        );
        res.status(200).json(editEmployee);
      }
    }
    if (temp == 0) {
      const editEmp = await employee.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          email: req.body.email,
          password: hash,
          phone: req.body.phone,
          $push: {
            address: {
              city: req.body.address.city,
              state: req.body.address.state,
              pincode: req.body.address.pincode,
            },
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json(editEmp);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fileUpload = async (req, res) => {
  // console.log(req.params.id);
  if (!req.params.id) {
    res.status(400).json({ message: "Route Not Found" });
  }
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    try {
      if (req.file) {
        const fileUpload = await employee.updateOne(
          { _id: req.params.id },
          {
            $push: {
              file: req.file.path,
            },
          },
          {
            new: true,
          }
        );
        res.status(200).json(fileUpload);
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
};
