const mongoose = require('mongoose');

const modelProperties = {
  taskTitle: {
    type: String,
    required: [true, 'Please provide with a task title']
  },
  description: {
    type: String
  },
  status: {
    type: String,
    required: [true, 'Please provide with a task status'],
    default: 'toDo'
  },
  priority: {
    type: String
  },
  deadline: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
};
const modelOptions = {
  timestamps: true
};

const taskSchema = mongoose.Schema(modelProperties, modelOptions);
module.exports = taskSchema;
