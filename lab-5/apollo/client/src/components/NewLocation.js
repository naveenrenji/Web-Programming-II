import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPLOAD_LOCATION_MUTATION } from "../graphql/mutations";

function checkImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.width > 0) {
        resolve();
      } else {
        reject(new Error("Please enter a valid image URL"));
      }
    };
    image.onerror = () => {
      reject(new Error("Please enter a valid image URL"));
    };
    image.src = url;
  });
}

function checkTitle(title) {
  if (!title) throw new Error("You must provide a Title");
  if (typeof title !== "string") throw new Error("Name must be a string");
  title = title.trim();
  if (title.length < 2)
    throw new Error("Title must have at least two letters");
  if (!/^[a-zA-Z\s]+$/.test(title))
    throw new Error(
      "Title cannot have special characters or punctuations except ones useful in a title"
    );
  if (/^\d+$/.test(title)) {
    throw new Error("Title cannot be all numbers");
  }
  return title;
}

function checkAddress(address) {
  if (!address) throw new Error("You must provide an address");
  if (typeof address !== "string")
    throw new Error("Address must be a string");
  address = address.trim();
  if (!/^[a-zA-Z0-9\s,'-]+$/.test(address))
    throw new Error("Address cannot have special characters");
  return address;
}

const NewLocation = () => {
  const [image, setImage] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  const [uploadLocation] = useMutation(UPLOAD_LOCATION_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await checkImage(image);
      checkTitle(name);
      checkAddress(address);

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
