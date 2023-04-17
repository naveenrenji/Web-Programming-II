import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});

const uploadLocation = async (location) => {
  let userUploadedLocations = await getUserUploadedLocations();
  let updatedLocations = [];
  try {
    if (userUploadedLocations) {
      updatedLocations = Array.isArray(userUploadedLocations)
        ? [...userUploadedLocations, location]
        : [userUploadedLocations, location];
    } else {
      updatedLocations = [location];
    }
    await client.set("userUploadedLocations", JSON.stringify(updatedLocations));
    return location;
  } catch (e) {
    return e;
  }
};

const getUserUploadedLocations = async () => {
  let userUploadedLocationsExists = await client.exists(
    "userUploadedLocations"
  );
  if (userUploadedLocationsExists) {
    let userUploadedLocations = await client.get("userUploadedLocations");
    userUploadedLocations = JSON.parse(userUploadedLocations);
    return userUploadedLocations;
  } else {
    return [];
  }
};

const getUserLikedLocations = async () => {
  let userLikedLocationsExists = await client.exists("userLikedLocations");
  if (userLikedLocationsExists) {
    let userLikedLocations = await client.get("userLikedLocations");
    userLikedLocations = JSON.parse(userLikedLocations);
    return userLikedLocations;
  } else {
    return [];
  }
};

const deleteLocation = async (id) => {
  let userUploadedLocations = await getUserUploadedLocations();
  let userLikedLocations = await getUserLikedLocations();

  let deletedLocation = null;

  const uploadedIndex = userUploadedLocations.findIndex((loc) => loc.id === id);
  if (uploadedIndex >= 0) {
    deletedLocation = userUploadedLocations[uploadedIndex];
    userUploadedLocations.splice(uploadedIndex, 1);
    await client.set(
      "userUploadedLocations",
      JSON.stringify(userUploadedLocations)
    );
  }

  const likedIndex = userLikedLocations.findIndex((loc) => loc.id === id);
  if (likedIndex >= 0) {
    deletedLocation = userLikedLocations[likedIndex];
    userLikedLocations.splice(likedIndex, 1);
    await client.set("userLikedLocations", JSON.stringify(userLikedLocations));
  }

  if (!deletedLocation) {
    throw new Error("Location not found");
  }

  return deletedLocation;
};

export {
  client,
  getUserUploadedLocations,
  uploadLocation,
  getUserLikedLocations,
  deleteLocation,
};
