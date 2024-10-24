const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



const UserSchema = new Schema({
  email: { type: String, required: true,unique:true },
  
  firstName: String,
  lastName: String, 
  password: String
});


const AdminSchema = new Schema({
  email: { type: String, required: true,unique:true },
  
  firstName: String,
  lastName: String, 
  password: String
});


const CourseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  AdminId: { type: ObjectId, ref: 'admin' } // Reference to the 'admin' model
});


const PurchaseSchema = new Schema({
  courseId: { type: ObjectId, ref: 'course' }, // Reference to the 'course' model
  UserId: { type: ObjectId, ref: 'user' } // Reference to the 'user' model
});


const userModel = mongoose.model('user', UserSchema);
const adminModel = mongoose.model('admin', AdminSchema);
const courseModel = mongoose.model('course', CourseSchema);
const purchaseModel = mongoose.model('purchase', PurchaseSchema);


module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel
};
