const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');


const userSchema = new mongoose.Schema({
  // creating the schema
  
  name: {
    type: String,
    required: true,
    trim: true,
  }, 
  email: {
    type: String,
    required: true,
    unique:true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password is not valid");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age is not valid!");
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required:true,
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
    timestamps: true,    // by enabling this we can know that when the user is created
});


// this is not a actual data and not stored in database but it stablish a relation bw user and task
userSchema.virtual('tasks', { 
  ref: 'Task',
  localField: '_id',
  foreignField:'owner',
})



userSchema.methods.toJSON = function () {   // when we call res.send() method behind the scene it calls JSON.stringfy() method that calls toJSON and  and we get the output that toJSON method sends.
  
  const user = this;
  const userObject = user.toObject();

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject;

}


// this method is accessable to model instances
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  
  user.tokens = user.tokens.concat({ token }) 
  await user.save();
  return token;
}






// creating the custom method in userschema  to login that is accessable in mongoose models.
userSchema.statics.findByCredentails = async (email, password) => {
  
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  

  return user;

}







// hash the plain text password before saving.
// we are using a middleware before the saving data it takes two arument frist the operation before like save and second a ideal func not arrow func so we can accsess this keyword

userSchema.pre('save', async function (next) {  
  const user = this;
  
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next(); // this is neccessary to get called for escaping the middleware
});


// Delete user tasks when user is removed

userSchema.pre('remove', async function (next){
  const user = this
  await Task.deleteMany({ owner: user._id });

  next();
})



const User = mongoose.model("User",userSchema);
module.exports = User;









