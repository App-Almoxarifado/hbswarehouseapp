  
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const User = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  /*passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },*/
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

User.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

mongoose.model('users', User);
