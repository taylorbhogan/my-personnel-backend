const express = require("express");
const router = express.Router();
const { getUserToken } = require("../auth");
const employeeModel = require("../models/employee");

const departmentRouter = require("./api/departments");
const employeeRouter = require("./api/employees");

router.use("/api/departments", departmentRouter);
router.use("/api/employees", employeeRouter);

router.post("/api/signup", async (req, res) => {
  const userData = req.body;
  const newUser = new employeeModel(userData);

  const token = getUserToken(newUser);

  try {
    const mongoResponse = await newUser.save();
    res.json({
      newUserData: mongoResponse,
      token,
    });
  } catch (error) {
    res.json(error);
  }
});

router.post("/api/login", async (req, res) => {
  const { _id } = req.body;
  const user = await employeeModel.findOne({ _id });

  const token = getUserToken(user);

  if (user) {
    res.json({ user, token });
  } else {
    res.json("error");
  }
});

module.exports = router;
