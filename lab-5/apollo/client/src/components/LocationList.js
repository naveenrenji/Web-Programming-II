import React from "react";
import LocationListItem from "./LocationListItem";
import { useQuery } from "@apollo/client";
import { GET_LOCATIONS_QUERY } from "../graphql/queries";

const LocationList = ({ locations, onLike, onRemoveLike }) => {
  const { loading, error } = useQuery(GET_LOCATIONS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="grid-container">
      {locations.map((location) => (
        <LocationListItem
          key={location.id}
          location={location}
          onLike={onLike}
          onRemoveLike={onRemoveLike}
        />
      ))}
    </div>
  );
};


export default LocationList;
