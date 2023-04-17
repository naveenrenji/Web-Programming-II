import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPLOAD_LOCATION_MUTATION } from "../graphql/mutations";

const NewLocation = () => {
  const [image, setImage] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  // src/NewLocation.js (continued)
  const [uploadLocation] = useMutation(UPLOAD_LOCATION_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await uploadLocation({
        variables: { image, address, name },
      });
      alert("Location uploaded successfully");
      setImage("");
      setAddress("");
      setName("");
    } catch (error) {
      alert(`Error uploading location: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload New Location</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Image URL:
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Location Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Upload Location</button>
      </form>
    </div>
  );
};

export default NewLocation;
