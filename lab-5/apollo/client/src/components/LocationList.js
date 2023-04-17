import React from "react";
import LocationListItem from "./LocationListItem";
import { useQuery } from "@apollo/client";
import { GET_LOCATIONS_QUERY } from "../graphql/queries";

const LocationList = ({ handleLike, refetchLocations }) => {
  const { loading, error, data } = useQuery(GET_LOCATIONS_QUERY);

  const onLikeWrapper = (id) => {
    handleLike(id);
    refetchLocations();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="grid-container">
      {data.locationPosts.map((location) => (
        <LocationListItem
          key={location.id}
          location={location}
          onLike={onLikeWrapper}
        />
      ))}
    </div>
  );
};

export default LocationList;
