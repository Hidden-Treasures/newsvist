import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate: {
        validator: function (value) {
          const hasLowercase = /[a-z]/.test(value);
          const hasUppercase = /[A-Z]/.test(value);
          const hasDigit = /\d/.test(value);
          const hasSymbol = /[@$!%*?&]/.test(value);
          const isLengthValid = value.length >= 8;

          return (
            hasLowercase &&
            hasUppercase &&
            hasDigit &&
            hasSymbol &&
            isLengthValid
          );
        },
        message:
          "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 digit and 1 symbol",
      },
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
      enum: ["reader", "journalist", "editor", "admin"],
      default: "reader",
    },
    profilePhoto: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      responsive: [URL],
      default:
        "https://res.cloudinary.com/deazsxjtf/image/upload/v1753176879/newsvist-profile-picture_vi5org.png",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
