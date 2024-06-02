## Getting Started

Firstly, copy `.env.example` file in the root of the folder and rename it `.env.local`.

Paste OpenWeather api key under `WEATHER_APP_KEY` and use the same MongoDB URI unless a change is required.

```bash
$ docker compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

Used [slim-2.csv](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/slim-2/slim-2.csv) which contains an array of country code to country names for mapping of country search.
