const express = require("express");
const faker = require("@faker-js/faker");
const router = express.Router();
const employeeModel = require("../../models/employee");
const { requireAuth } = require('../../auth')

router.use(requireAuth)

// GET - get all employee records from the db
router.get("/", async (req, res) => {
  const allEmployees = await employeeModel.find();
  res.json(allEmployees);
});

// POST - add a new employee record to the db
router.post("/", async (req, res) => {
  const employeeData = req.body;
  const newEmployee = new employeeModel(employeeData);

  try {
    const mongoResponse = await newEmployee.save();
    res.status(201).json({newEmployeeData: mongoResponse});
  } catch (error) {
    res.json(error);
  }
  // when adding address: {} I noticed an UnhandledPromiseRejectionWarning for this line
  res.json("an unexpected error occurred");
});

// GET - get a record from the database for the employee with this id
// note: this route is currently unused
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const employee = await employeeModel.findOne({ _id: id });
    res.json(employee);
  } catch (error) {
    res.status(404).end()
  }
});

// PATCH - edit a single record in the database
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const newEmployeeData = req.body;
  const { email, phone, address, name, title, department, isAdmin } = newEmployeeData;
  const { personal, corporate } = phone;
  const { street1, street2, city, state, zip, country } = address;
  const { first, middle, last } = name;

  const mongoResponse = await employeeModel.findOneAndUpdate(
    { _id: id },
    {
      email,
      title,
      department,
      isAdmin,
      name: {
        first,
        middle,
        last,
      },
      phone: {
        personal,
        corporate,
      },
      address: {
        street1,
        street2,
        city,
        state,
        zip,
        country,
      },
    },
    { new: true }
  );

  res.json(mongoResponse);
});

// DELETE - remove a single record from the database
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const mongoResponse = await employeeModel.deleteOne({ _id: id });
    const { deletedCount } = mongoResponse;
    if (deletedCount === 1) {
      const allEmployees = await employeeModel.find();
      res.json(allEmployees);
    } else {
      res.json(
        "An unexpected error may have occurred while deleting from the database. Try refreshing the page."
      );
    }
  } catch (error) {
    console.log("error:", error);
    res.json(error);
  }
});

// router.get('/addRandom', async (req, res) => {
//   const fakeFirstName = faker.name.firstName();
//   const fakeLastName = faker.name.lastName();

//   const taxDocs = [];
//   const numTaxDocs = faker.datatype.number({ min: 0, max: 3 });
//   for (let i = 0; i <= numTaxDocs; i++) {
//     taxDocs.push(faker.internet.url());
//   }

//   const departments = [
//     "Sales",
//     "Marketing",
//     "Design",
//     "Engineering",
//     "Operations",
//     "Quality",
//     "Finance",
//     "Human Resources",
//     "Security",
//     "Administration",
//   ];
//   const departmentIndex = Math.floor(Math.random() * departments.length);
//   const department = departments[departmentIndex];

//   const employee = {
//     corporateId: faker.datatype.number({ min: 11122, max: 99999 }),
//     name: {
//       first: fakeFirstName,
//       middle: faker.name.firstName(),
//       last: fakeLastName,
//     },
//     title: faker.name.title(),
//     department: department,
//     admin: faker.datatype.boolean(),
//     phone: {
//       personal: faker.phone.phoneNumber("(###) ###-####"),
//       corporate: faker.phone.phoneNumber("(###) ###-#### x####"),
//     },
//     email: faker.internet.email(
//       fakeFirstName,
//       fakeLastName,
//       "benevolentorg.com"
//     ),
//     address: {
//       street1: faker.address.streetAddress(),
//       street2: faker.address.secondaryAddress(),
//       city: faker.address.city(),
//       state: faker.address.state(),
//       zip: faker.address.zipCode(),
//       country: faker.address.country(),
//     },
//     pto: faker.datatype.number({ min: 10, max: 60 }),
//     taxDocuments: taxDocs,
//     imgUrl: faker.image.avatar(),
//     // directSupervisor: '6217ccd822a75a5caca18115',
//   };
//   const newEmployee = new employeeModel(employee)
//   console.log(newEmployee);
//   try {
//     const mongoResponse = await newEmployee.save();
//     console.log("mongoResponse",mongoResponse);
//     res.json(mongoResponse);
//   } catch (error) {
//     console.log("error:", error);
//     res.json(error);
//   }

// })

module.exports = router;
