// src/components/UserPostedLocations.js
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_POSTED_LOCATIONS_QUERY } from "../graphql/queries";
import LocationListItem from "./LocationListItem";

const UserPostedLocations = () => {
  const { loading, error, data, refetch } = useQuery(GET_USER_POSTED_LOCATIONS_QUERY);
  const [userPostedLocations, setUserPostedLocations] = useState([]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (data) {
    if (userPostedLocations.length === 0) {
      setUserPostedLocations(data.userPostedLocations);
    }
  }

  const handleLike = (id) => {
    setUserPostedLocations(
      userPostedLocations.map((location) =>
        location.id === id ? { ...location, liked: !location.liked } : location
      )
    );
  };

  return (
    <div>
      {userPostedLocations.map((location) => (
        <LocationListItem key={location.id} location={location} onLike={handleLike}   refetchLocations={refetch}
        />
      ))}
    </div>
  );
};

export default UserPostedLocations;
