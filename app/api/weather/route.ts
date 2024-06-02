import { findCountry } from "@/app/lib/country";
import { addToHistory } from "@/app/lib/history";
import { connectToMongo } from "@/app/lib/mongo";
import HistoryModel from "@/app/model/history";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const city = formData.get("city");
  const country = formData.get("country");

  const lat = formData.get("lat");
  const lon = formData.get("lon");

  if (lat && lon) {
    const weatherInfo = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lat}&units=metric&appid=${process.env.WEATHER_APP_KEY}`
    );
    const weatherJson = await weatherInfo.json();

    await fetch(`http://localhost:3000/api/history`, {
      method: "POST",
      body: JSON.stringify({
        city: city,
        country: country,
        lat: lat,
        lon: lon,
      }),
    });
    return Response.json({
      name: city,
      country: country,
      latLon: [lat, lon],
      weather: weatherJson.current,
    });
  }
  const countryCode = findCountry(String(country))?.["alpha-2"];

  const cityInfo = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=5&appid=${process.env.WEATHER_APP_KEY}`
  );
  const cityJson = await cityInfo.json();
  if (cityJson.length === 0) {
    return Response.json({ message: "Place not found" }, { status: 500 });
  }
  const latLon = [cityJson[0].lat, cityJson[0].lon];

  const weatherInfo = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latLon[0]}&lon=${latLon[1]}&units=metric&appid=${process.env.WEATHER_APP_KEY}`
  );
  const weatherJson = await weatherInfo.json();

  try {
    await addToHistory(
      cityJson[0].name,
      cityJson[0].country,
      latLon[0],
      latLon[1]
    );
  } catch (e) {
    console.log("Failed to add to history");
  }

  return Response.json({
    name: cityJson[0].name,
    country: cityJson[0].country,
    latLon,
    weather: weatherJson.current,
  });
}
