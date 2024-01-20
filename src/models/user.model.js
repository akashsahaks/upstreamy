import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      fullName: {
         type: String,
         required: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      avatar: {
         type: String, //cloudinary url
         required: true,
      },
      coverImage: {
         type: String, //cloudinary url
      },
      watchHistory: {
         type: Schema.Types.ObjectId,
         ref: "Video",
      },
      password: {
         type: String,
         required: [true, "Password is required"],
      },
      refreshToken: {
         type: String,
      },
   },
   {
      timestamps: true,
   }
);

// don't use arrow function bcz it doesn't have this accesss(context) use normal function
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   let saltRound = 10;
   this.password = bcrypt.hash(this.password, saltRound);
   next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
   let payLoad = {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
   };

   let secret = process.env.ACCESS_TOKEN_SECRET;

   let options = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
   };

   return jwt.sign(payLoad, secret, options);
};

userSchema.methods.generateRefreshToken = async function () {
   let payLoad = {
      _id: this._id,
      email: this.email,
   };

   let secret = process.env.REFRESH_TOKEN_SECRET;

   let options = {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
   };

   return jwt.sign(payLoad, secret, options);
};

export const User = mongoose.model("User", userSchema);
