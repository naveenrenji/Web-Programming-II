import axios from "axios";

async function fetchLocationsFromPlacesAPI(pageNum = 1) {
  const options = {
    method: "GET",
    url: "https://api.foursquare.com/v3/places/search",
    params: { limit: "50" },
    headers: {
      accept: "application/json",
      Authorization: "fsq3mWqTifhAtKWIaTji2m5o4j4N4L/X5fdOtV9PCgS9IaQ=",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.results;
  } catch (error) {
    throw new Error(`An error occurred: ${error}`);
  }
}

async function fetchPlacePhotos(fsq_id) {
  const options = {
    method: "GET",
    url: `https://api.foursquare.com/v3/places/${fsq_id}/photos`,
    headers: {
      accept: "application/json",
      Authorization: "fsq3mWqTifhAtKWIaTji2m5o4j4N4L/X5fdOtV9PCgS9IaQ=",
    },
  };

  try {
    const response = await axios.request(options);
    if (!response.data || response.data.length === 0) {
      return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    }
    let photo = response.data[0];
    let photoURl = photo.prefix + "400x400" + photo.suffix;
    return photoURl;
  } catch (error) {
    throw new Error(`An error occurred: ${error}`);
  }
}

export { fetchLocationsFromPlacesAPI, fetchPlacePhotos };
