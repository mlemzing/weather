import { Schema, model, models } from "mongoose";
const historySchema = new Schema(
  {
    city: String,
    country: String,
    lat: Number,
    lon: Number,
  },
  {
    timestamps: true,
  }
);
const HistoryModel = models.history || model("history", historySchema);
export default HistoryModel;
