import { gql } from "apollo-server";
import { v4 as uuidv4 } from "uuid";
import {
  uploadLocation,
  getUserUploadedLocations,
  getUserLikedLocations,
  deleteLocation,
  client,
} from "./redisClient.js";
import { fetchLocationsFromPlacesAPI, fetchPlacePhotos } from "./placesAPI.js";

// (existing typeDefs code)
const typeDefs = gql`
  type Location {
    id: ID!
    image: String!
    address: String
    name: String!
    liked: Boolean!
    userPosted: Boolean!
  }

  type Query {
    locationPosts(pageNum: Int): [Location]
    likedLocations: [Location]
    userPostedLocations: [Location]
  }

  type Mutation {
    uploadLocation(image: String!, address: String, name: String): Location
    updateLocation(
      id: ID!
      image: String
      name: String
      address: String
      userPosted: Boolean
      liked: Boolean
    ): Location
    deleteLocation(id: ID!): Location
  }
`;

const resolvers = {
  Query: {
    locationPosts: async (_, { pageNum }) => {
      const locations = await fetchLocationsFromPlacesAPI(pageNum);
      try {
        const locationsWithPhotos = await Promise.all(
          locations.map(async (location) => {
            let photoUrl;
            try {
              photoUrl = await fetchPlacePhotos(location.fsq_id);
            } catch (error) {
              console.log(
                "Error fetching photo for location:",
                location.fsq_id
              );
              photoUrl =
                "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
            }

            return {
              ...location,
              address: location.location.formatted_address,
              id: location.fsq_id,
              image: photoUrl,
              liked: false,
              userPosted: false,
            };
          })
        );
        return locationsWithPhotos;
      } catch (error) {
        console.log(error);
      }
    },
    likedLocations: async () => {
      const likedLocations = await getUserLikedLocations();
      const likedLocationsWithDefaultImage = likedLocations.map((location) => {
        if (!location.image) {
          return {
            ...location,
            image:
              "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
          };
        }
        return location;
      });
      return likedLocationsWithDefaultImage;
    },
    userPostedLocations: async () => {
      const userPostedLocations = await getUserUploadedLocations();
      return userPostedLocations;
    },
  },
  Mutation: {
    uploadLocation: async (_, { image, address, name }) => {
      const id = uuidv4();
      const location = {
        id,
        image,
        address,
        name,
        liked: false,
        userPosted: true,
      };
      const postedLocation = await uploadLocation(location);
      return postedLocation;
    },
    updateLocation: async (
      _,
      { id, image, name, address, userPosted, liked }
    ) => {
      // Fetch and update the location data
      const likedLocations = await getUserLikedLocations();
      const uploadedLocations = await getUserUploadedLocations();
      const locationIndex = likedLocations.findIndex((loc) => loc.id === id);
      const postedLocationIndex = uploadedLocations.findIndex(
        (loc) => loc.id === id
      );
      if (locationIndex >= 0) {
        if (likedLocations[locationIndex].liked) {
          liked = false;
        } else {
          liked = true;
        }
      } else {
        liked = true;
      }

      const updatedLocation = {
        id: id,
        image: image,
        name: name,
        address: address,
        userPosted: userPosted,
        liked: liked,
      };

      console.log(uploadedLocations);
      if (postedLocationIndex >= 0) {
        uploadedLocations[postedLocationIndex] = updatedLocation;
      }
      console.log(uploadedLocations);

      if (liked) {
        if (locationIndex < 0) {
          likedLocations.push(updatedLocation);
        } else {
          likedLocations[locationIndex] = updatedLocation;
        }
      } else {
        if (locationIndex >= 0) {
          likedLocations.splice(locationIndex, 1);
        }
      }
      await client.set("userUploadedLocations", JSON.stringify(uploadedLocations));

      await client.set("userLikedLocations", JSON.stringify(likedLocations));
      return updatedLocation;
    },
    deleteLocation: async (_, { id }) => {
      const deletedLocation = await deleteLocation(id);

      return deletedLocation;
    },
  },
};
export { typeDefs, resolvers };
