import React, { useState, useEffect } from "react";
import LocationListItem from "./LocationListItem";
import { useQuery, useApolloClient } from "@apollo/client";
import { UPDATE_LOCATION_MUTATION } from "../graphql/mutations";
import { GET_LIKED_LOCATIONS_QUERY } from "../graphql/queries";

const LikedLocations = () => {
  const client = useApolloClient();
  const { loading, error, data, refetch } = useQuery(GET_LIKED_LOCATIONS_QUERY);
  const [likedLocations, setLikedLocations] = useState([]);

  useEffect(() => {
    if (data) {
      setLikedLocations(data.likedLocations);
    }
  }, [data]);

  const onRemoveLike = async (id) => {
    await client.mutate({
      mutation: UPDATE_LOCATION_MUTATION,
      variables: { id },
    });

    refetch();
  };

if (loading) return <p>Loading...</p>;
if (error) {
  console.log("Error in LikedLocations:", error);
  return <p>Error :(</p>;
}

  return (
    <div>
      {likedLocations.length > 0 ? (
        likedLocations.map((location) => (
          <LocationListItem
            key={location.id}
            location={location}
            onLike={onRemoveLike}
          />
        ))
      ) : (
        <p>There are no liked locations.</p>
      )}
    </div>
  );
};

export default LikedLocations;
