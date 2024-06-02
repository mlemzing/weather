import mongoose from "mongoose";
import HistoryModel from "../model/history";
import { connectToMongo } from "./mongo";

export const addToHistory = async (
  city: String,
  country: String,
  lat: Number,
  lon: Number
) => {
  await connectToMongo();
  await HistoryModel.create({
    city,
    country,
    lat,
    lon,
  });
  await mongoose.connection.close();
};
