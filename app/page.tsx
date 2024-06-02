"use client";

import { Switch } from "@headlessui/react";
import {
  IconMoonFilled,
  IconSearch,
  IconSunFilled,
  IconTrash,
} from "@tabler/icons-react";
import moment from "moment";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);

  const { theme, setTheme } = useTheme();
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(false);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/weather`, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) {
        throw Error("Place not found");
      }

      const data = await response.json();

      setCity(data.name);
      setCountry(data.country);
      setWeather(data.weather);
      getHistory();
    } catch (e) {
      setCity("");
      setWeather(null);
      setLoading(false);
      setError(true);
    }
    setLoading(false);
  }

  async function getHistory() {
    setHistory((await (await fetch(`/api/history`)).json()).history);
  }

  async function deleteHistory(item: any) {
    await fetch(`/api/history`, {
      method: "DELETE",
      body: JSON.stringify(item),
    });
    getHistory();
  }

  async function searchItem(item: any) {
    const formData = new FormData();
    formData.append("lat", item.lat);
    formData.append("lon", item.lon);
    formData.append("city", item.city);
    formData.append("country", item.country);
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(`/api/weather`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setCity(data.name);
      setCountry(data.country);
      setWeather(data.weather);
      getHistory();
    } catch (e) {
      setCity("");
      setWeather(null);
      setLoading(false);
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <main className="flex flex-col gap-2 max-w-screen-sm mx-auto p-4">
      <span className="border-b flex justify-between">
        <h1 className="text-xl">{`Today's Weather`}</h1>
        {theme && (
          <span>
            <Switch
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-neutral-600"
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6">
                {theme === "light" ? (
                  <IconSunFilled className="h-full m-auto w-full text-yellow-600" />
                ) : (
                  <IconMoonFilled className="h-full w-full m-auto text-neutral-700" />
                )}
              </span>
            </Switch>
          </span>
        )}
      </span>
      <div>
        <form onSubmit={onSubmit} className="grid gap-2 grid-cols-2 ">
          <span className="flex flex-col gap-1 col-span-2 md:col-span-1">
            <label className="text-sm">City</label>
            <input
              type="text"
              name="city"
              id="city"
              className="rounded p-1 border"
            ></input>
          </span>
          <span className="flex flex-col gap-1 col-span-2 md:col-span-1">
            <label className="text-sm">Country</label>
            <input type="text" name="country" className="rounded p-1 border" />
          </span>
          <div className="ml-auto flex text-sm self-end py-2 col-span-2">
            <button
              type="reset"
              className="px-2 rounded py-1 text-neutral-700 dark:text-neutral-300"
            >
              Clear
            </button>
            <button className="px-3 rounded-full h-fit bg-blue-500 py-2 text-white">
              Submit
            </button>
          </div>
        </form>
      </div>
      <h2 className="border-b text-xl">Weather info</h2>
      <div>
        {error && <div className="text-red-500">Place does not exist</div>}
        {loading && <div>Loading...</div>}
        {weather && !loading && (
          <div className="text-blue-500 dark:text-blue-300 flex flex-col">
            <span>
              {city}, {country}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center">
                {/* @ts-ignore */}
                <span className="text-4xl font-semibold">{weather.temp}°C</span>
                <Image
                  width={48}
                  height={48}
                  alt="Weather Icon"
                  // @ts-ignore
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                />
              </div>
              <span>
                {/* @ts-ignore */}
                Description: {weather.weather[0].main} - {/* @ts-ignore */}
                {weather.weather[0].description}
              </span>
              {/* @ts-ignore */}
              <span>Humidity: {weather.humidity}%</span>
              <span>Time: {moment().format("hh:mm:ss A")}</span>
            </div>
          </div>
        )}
      </div>
      <h3 className="border-b text-xl">History</h3>
      <div className="max-w-full">
        <ul className="space-y-2">
          {history &&
            history.map((item, index) => (
              <li key={index} className="grid grid-cols-10 items-center">
                <div className="grid col-span-7">
                  <div className="flex gap-1">
                    <span>{index + 1}.</span>
                    <span className="col-span-6">
                      {/* @ts-ignore */}
                      {item.city}, {item.country}
                    </span>
                  </div>
                  <span className="col-span-3 text-sm text-neutral-800 dark:text-neutral-300">
                    {/* @ts-ignore */}
                    {moment(item.createdAt).format("hh:mm:ss A")}
                  </span>
                </div>
                <div className="flex ml-auto col-span-3 gap-2">
                  <button onClick={() => searchItem(item)}>
                    <IconSearch className="" />
                  </button>
                  <button onClick={() => deleteHistory(item)}>
                    <IconTrash className="text-red-600" />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </main>
  );
}
