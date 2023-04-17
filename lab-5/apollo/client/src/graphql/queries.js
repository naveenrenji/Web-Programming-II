import { gql } from "@apollo/client";

export const GET_LOCATIONS_QUERY = gql`
  query GetLocations($pageNum: Int) {
    locationPosts(pageNum: $pageNum) {
      id
      image
      address
      name
      liked
      userPosted
    }
  }
`;

export const GET_LIKED_LOCATIONS_QUERY = gql`
  query GetLikedLocations {
    likedLocations {
      id
      image
      address
      name
      liked
      userPosted
    }
  }
`;

export const GET_USER_POSTED_LOCATIONS_QUERY = gql`
  query GetUserPostedLocations {
    userPostedLocations {
      id
      image
      address
      name
      liked
      userPosted
    }
  }
`;
