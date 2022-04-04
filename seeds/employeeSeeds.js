const { faker } = require("@faker-js/faker");
// const employeeModel = require("../models/employee");

const seedEmployeeData = async () => {
  const fakeFirstName = faker.name.firstName();
  const fakeLastName = faker.name.lastName();

  const taxDocs = [];
  const numTaxDocs = faker.datatype.number({ min: 0, max: 3 });
  for (let i = 0; i <= numTaxDocs; i++) {
    taxDocs.push(faker.internet.url());
  }

  const departments = [
    "Sales",
    "Marketing",
    "Design",
    "Engineering",
    "Operations",
    "Quality",
    "Finance",
    "Human Resources",
    "Security",
    "Administration",
  ];
  const departmentIndex = Math.floor(Math.random() * departments.length);
  const department = departments[departmentIndex];

  const employee = {
    corporateId: faker.datatype.number({ min: 11122, max: 99999 }),
    name: {
      first: fakeFirstName,
      middle: faker.name.firstName(),
      last: fakeLastName,
    },
    title: faker.name.title(),
    department: department,
    admin: faker.datatype.boolean(),
    phone: {
      personal: faker.phone.phoneNumber("(###) ###-####"),
      corporate: faker.phone.phoneNumber("(###) ###-#### x####"),
    },
    email: faker.internet.email(
      fakeFirstName,
      fakeLastName,
      "benevolentorg.com"
    ),
    address: {
      street1: faker.address.streetAddress(),
      street2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      country: faker.address.country(),
    },
    pto: faker.datatype.number({ min: 10, max: 60 }),
    taxDocuments: taxDocs,
    imgUrl: faker.image.avatar(),
    directSupervisor: "6218213f4c061098e3013074",
  };
  // const newEmployee = new employeeModel(employee)
  console.log(employee);
  // try {
  //   const mongoResponse = await newEmployee.save()
  //   console.log(mongoResponse);

  // } catch (error) {
  //   console.log(error);
  // }

};
seedEmployeeData();
