import React, { useState, useEffect } from "react";
import LocationListItem from "./LocationListItem";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_LOCATION_MUTATION } from "../graphql/mutations";
import { GET_USER_POSTED_LOCATIONS_QUERY } from "../graphql/queries";
import { DELETE_LOCATION_MUTATION } from "../graphql/mutations";
import { NavLink } from "react-router-dom";

const UserPostedLocations = () => {
  const [updateLocation] = useMutation(UPDATE_LOCATION_MUTATION);
  const [deleteLocation] = useMutation(DELETE_LOCATION_MUTATION);
  const { loading, error, data, refetch } = useQuery(GET_USER_POSTED_LOCATIONS_QUERY);
  const [userLocations, setUserLocations] = useState([]);
  const [likedLocations, setLikedLocations] = useState([]);


  useEffect(() => {
    refetch();
    if (data) {
      setUserLocations(data.userPostedLocations);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleDelete = async (locationToDelete) => {
    try {
      await deleteLocation({
        variables: {
          id: locationToDelete.id,
        },
      });
      setUserLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== locationToDelete.id)
      );
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };
  

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
        <nav>
        <NavLink className="showlink" to="/new-location">
                New Location
              </NavLink>
        </nav>
        <br>
        </br>
        <br>
        </br>
      {userLocations.length > 0 ? (
        userLocations.map((location) => (
          <LocationListItem
            key={location.id}
            location={location}
            onLike={handleLike}
            onRemoveLike={handleRemoveLike}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>You have not posted any locations.</p>
      )}
    </div>
  );
};

export default UserPostedLocations;
