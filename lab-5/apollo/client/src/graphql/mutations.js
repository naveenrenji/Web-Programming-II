import { gql } from "@apollo/client";

export const UPLOAD_LOCATION_MUTATION = gql`
  mutation UploadLocation($image: String!, $address: String, $name: String) {
    uploadLocation(image: $image, address: $address, name: $name) {
      id
      image
      address
      name
      liked
      userPosted
    }
  }
`;

export const UPDATE_LOCATION_MUTATION = gql`
  mutation UpdateLocation(
    $id: ID!
    $image: String
    $name: String
    $address: String
    $userPosted: Boolean
    $liked: Boolean
  ) {
    updateLocation(
      id: $id
      image: $image
      name: $name
      address: $address
      userPosted: $userPosted
      liked: $liked
    ) {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
`;

export const DELETE_LOCATION_MUTATION = gql`
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id) {
      id
      image
      address
      name
      liked
      userPosted
    }
  }
`;
