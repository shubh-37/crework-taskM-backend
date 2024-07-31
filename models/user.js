const mongoose = require("mongoose");

const modelProperties = {
  fullName: {
    type: String,
    required: [true, "Please provide with a task title"],
    default: 'John Doe'
  },
  emailId: {
    type: String,
    required: [true, "Please provide with a task title"],
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email ID!",
      ],
      unique: [true, "This email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please provide with a task title"]
  },
};
const modelOptions = {
    timestamps: true
  };
  
const userSchema = mongoose.Schema(modelProperties, modelOptions);
module.exports = userSchema;