"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/weather`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setCity(data.name);
    setWeather(data.weather);
  }

  return (
    <main className="flex flex-col m-4 gap-4">
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="city"
            id="city"
            className="text-blue-500"
          ></input>
          <button>Submit</button>
        </form>
      </div>
      <div>Weather info</div>
      {weather && (
        <div className="text-blue-300">
          {city}
          {/* @ts-ignore */}
          {weather.main}
        </div>
      )}
      <div>History</div>
    </main>
  );
}
