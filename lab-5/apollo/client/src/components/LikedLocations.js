import React, { useState, useEffect } from "react";
import LocationListItem from "./LocationListItem";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_LOCATION_MUTATION } from "../graphql/mutations";
import { GET_LIKED_LOCATIONS_QUERY } from "../graphql/queries";

const LikedLocations = () => {
  const { loading, error, data, refetch } = useQuery(GET_LIKED_LOCATIONS_QUERY);
  const [likedLocations, setLikedLocations] = useState([]);

  const [updateLocation] = useMutation(UPDATE_LOCATION_MUTATION);

  useEffect(() => {
    refetch();
    if (data) {
      setLikedLocations(data.likedLocations);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("Error in LikedLocations:", error);
    return <p>Error :(</p>;
  }

  const handleRemoveLike = async (updatedLocation) => {
    try {
      await updateLocation({
        variables: {
          id: updatedLocation.id,
          image: updatedLocation.image,
          name: updatedLocation.name,
          address: updatedLocation.address,
          userPosted: updatedLocation.userPosted,
          liked: false,
        },
      });
  
      setLikedLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== updatedLocation.id)
      );
      await refetch();
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };
  
  const handleLike = async (updatedLocation) => {
    try {
      await updateLocation({
        variables: {
          id: updatedLocation.id,
          image: updatedLocation.image,
          name: updatedLocation.name,
          address: updatedLocation.address,
          userPosted: updatedLocation.userPosted,
          liked: !updatedLocation.liked,
        },
      });
  
      await refetch();
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };
  
  
  return (
    <div>
            <br>
    </br>
    <br>
    </br>
      {likedLocations.length > 0 ? (
        likedLocations.map((location) => (
          <LocationListItem
            key={location.id}
            location={location}
            onLike={handleLike}
            onRemoveLike={handleRemoveLike}
          />
        ))
      ) : (
        <p>There are no liked locations.</p>
      )}
    </div>
  );
};
export default LikedLocations;
