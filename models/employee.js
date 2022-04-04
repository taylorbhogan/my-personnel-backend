const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const employeeSchema = new mongoose.Schema({
  corporateId: Number,
  name: {
    first: String,
    middle: String,
    last: String,
  },
  password: String,
  title: String,
  department: String,
  admin: Boolean,
  phone: {
    personal: String,
    corporate: String,
  },
  email: String,
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  pto: Number,
  taxDocuments: [ String ],
  imgUrl: String,
  directSupervisor: mongoose.Schema.Types.ObjectId,
}, {
  timestamps: true
})

employeeSchema.pre('save', async function save(next){
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err)
  }
})

employeeSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password)
}

const employeeModel = mongoose.model('employee',employeeSchema)


module.exports = employeeModel;
