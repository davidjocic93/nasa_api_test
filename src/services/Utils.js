import { API_KEY } from "../constants/index";

export const buildUrl = (startDate, endDate) => `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;