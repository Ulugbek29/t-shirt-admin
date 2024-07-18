import axios from "axios";
import { apikey } from "../constants/mapDefaults";

const getGeoLocation = ({ lat, long }) => {
  return axios
    .get(
      // `https://search-maps.yandex.ru/v1/?apikey=${apikey}&text=${long},${lat}&lang=ru_RU`
      `https://geocode-maps.yandex.ru/1.x/?apikey=${apikey}&format=json&geocode=${lat},${long}&lang=uz_UZ&boundedBy=[[41.1921, 69.1313],[41.3757, 69.3492]]`
    )
    .then((response) => {
      return response.data; 
    })
    .catch((error) => {
      console.error("Error fetching geolocation:", error);
      throw error; // Re-throw the error to be handled by the caller
    });
};

export { getGeoLocation };
