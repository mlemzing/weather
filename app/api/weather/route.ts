import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const city = formData.get("city");

  const cityInfo = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.WEATHER_APP_KEY}`
  );
  const cityJson = await cityInfo.json();
  const latLon = [cityJson[0].lat, cityJson[0].lon];

  const weatherInfo = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latLon[0]}&lon=${latLon[1]}&appid=${process.env.WEATHER_APP_KEY}`
  );
  const weatherJson = await weatherInfo.json();
  return Response.json({
    name: cityJson[0].name,
    latLon,
    weather: weatherJson.current.weather[0],
  });
}
