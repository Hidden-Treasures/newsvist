import mongoose from "mongoose";

interface ISubCategory extends Document {
  name: string;
}

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const SubCategory = mongoose.model<ISubCategory>(
  "SubCategory",
  subCategorySchema
);

export default SubCategory;
