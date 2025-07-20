import mongoose, { Document, Schema } from "mongoose";
import SubCategory from "./Subcategory";

// Define the Category interface
interface ICategory extends Document {
  title: string;
  items: mongoose.Types.Array<mongoose.Types.ObjectId>;
}

// Define the schema
const categorySchema = new Schema<ICategory>({
  title: {
    type: String,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
  ],
});

// Create and export the model
const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
