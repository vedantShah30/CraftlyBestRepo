import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  HTML: {
    type: String,
  },
  CSS: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Code", codeSchema);
