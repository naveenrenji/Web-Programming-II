import React from 'react';
import { useQuery } from '@apollo/client';
import LocationList from './LocationList';
import { GET_LOCATIONS_QUERY } from '../graphql/queries';

const Home = () => {
  const { loading, error, data } = useQuery(GET_LOCATIONS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <LocationList locations={data.locationPosts} />;
};

export default Home;
