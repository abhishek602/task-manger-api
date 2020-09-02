
const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',      // this combine the realtion bw user and task
  }
}, {
  timestamps:true,   // by enabling this we can know that when the task is created
});



const Task = mongoose.model("Task", taskSchema);



module.exports = Task;