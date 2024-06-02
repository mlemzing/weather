import { connectToMongo } from "@/app/lib/mongo";
import HistoryModel from "@/app/model/history";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET() {
  await connectToMongo();
  const history = await HistoryModel.find({}).sort({ createdAt: -1 }).limit(10);
  await mongoose.connection.close();
  return Response.json({ history });
}

export async function DELETE(request: NextRequest) {
  const { _id } = await request.json();
  console.log(request);
  await connectToMongo();
  await HistoryModel.deleteOne({ _id });
  await mongoose.connection.close();
  return Response.json({ message: "ok" });
}

export async function POST(request: NextRequest) {
  const { city, country, lat, lon } = await request.json();

  await connectToMongo();
  await HistoryModel.create({
    city,
    country,
    lat: lat,
    lon: lon,
  });
  await mongoose.connection.close();
  return Response.json({ message: "ok" });
}
