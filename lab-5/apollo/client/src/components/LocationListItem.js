// src/components/LocationListItem.js
import React from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_LOCATION_MUTATION } from "../graphql/mutations";

const LocationListItem = ({ location, onLike }) => {
  const [updateLocation] = useMutation(UPDATE_LOCATION_MUTATION);

  const handleLike = async () => {
    try {
      await updateLocation({
        variables: {
          id: location.id,
          image: location.image,
          name: location.name,
          address: location.address,
          userPosted: location.userPosted,
          liked: !location.liked,
        },
      });
      onLike(location.id);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return (
    <div className="card">
      <h2>{location.name}</h2>
      <p>{location.address}</p>
      <img src={location.image} alt={location.name} />
      <button onClick={handleLike}>
        {location.liked ? "Remove Like" : "Like"}
      </button>
    </div>
  );
};

export default LocationListItem;
