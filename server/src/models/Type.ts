import mongoose from "mongoose";

const TypeSchema = new mongoose.Schema({
  name: { type: String },
});

const Type = mongoose.model("Type", TypeSchema);

export default Type;
