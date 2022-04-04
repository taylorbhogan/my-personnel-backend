const express = require("express");
const router = express.Router();
const departmentModel = require("../../models/department");

router.get("/", async (req, res) => {
  const mongoDepartments = await departmentModel.find();
  const allDepartments = [];
  mongoDepartments.forEach(department => {
    allDepartments.push(department.name)
  })

  res.json(allDepartments);
});

// TODO: connect this to the front end
router.post("/", async (req, res) => {
  const departmentData = req.body;
  const newDepartment = new departmentModel(departmentData);

  try {
    const mongoResponse = await newDepartment.save();
    res.json(mongoResponse);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
