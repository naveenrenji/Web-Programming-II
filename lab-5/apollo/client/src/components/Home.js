import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import LocationList from "./LocationList";
import { GET_LOCATIONS_QUERY } from "../graphql/queries";
import { Button } from "@mui/material";
import { UPDATE_LOCATION_MUTATION } from "../graphql/mutations";


const Home = () => {
  const { loading, error, data, refetch } = useQuery(GET_LOCATIONS_QUERY);
  const [locations, setLocations] = useState([]);
  const [loadedLocationsCount, setLoadedLocationsCount] = useState(5);
  const [likedLocations, setLikedLocations] = useState([]);
  const [updateLocation] = useMutation(UPDATE_LOCATION_MUTATION);

  useEffect(() => {
    if (data) {
      setLocations(data.locationPosts.slice(0, loadedLocationsCount));
    }
  }, [data, loadedLocationsCount]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

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

  const handleLoadMore = () => {
    setLoadedLocationsCount((prevCount) => prevCount + 5);
  };

  return (
    <>
    <br>
    </br>
    <br>
    </br>
      <LocationList locations={locations} onLike={handleLike} onRemoveLike={handleRemoveLike} />
      <div className="button-container">
        <br></br>
        {locations.length < 50 && (
          <Button onClick={handleLoadMore}>Get More</Button>
        )}
        <br></br>
      </div>
    </>
  );
};

export default Home;
