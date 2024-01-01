import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      minlength: 3,
      maxlength: 30,
      unique: [true, "Email address already taken"],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);


