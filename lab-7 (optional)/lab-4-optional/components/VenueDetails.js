import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Card, CardMedia, Box, Typography } from "@mui/material";
import noImage from "../img/download.jpeg";
import { styled } from "@mui/system";

const APIKEY = "e127Ifc0YAMBpVEonI4wblzsVmDm7LhC";
const StyledTitle = styled("h1")({
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 800,
  fontSize: "3rem",
  color: "#178577",
  marginBottom: "2rem",
  textAlign: "center",
});
const buildVenue = (venueData) => {
  const {
    images,
    name,
    address,
    city,
    state,
    country,
    timezone,
    parkingDetail,
    boxOfficeInfo,
    accessibleSeatingDetail,
    childRule,
    generalRule,
    upcomingEvents,
    url,
  } = venueData;
  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 650,
        mx: "auto",
        borderRadius: 5,
        border: "1px solid #178577",
        boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <br></br>
      <CardMedia
        sx={{
          height: "70%",
          width: "70%",
          borderRadius: 5,
          fontWeight: "bold",
          fontSize: "1.5rem",
          textAlign: "center",
          border: "1px solid #178577",
          boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
        }}
        component="img"
        image={images && images[0].url ? images[0].url : noImage}
        title={name}
      />
      <br></br>
      <Box sx={{ maxWidth: 600, mx: "auto", px: 2 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {name}
        </Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Address:
        </Typography>
        {address && city && state && country ? (
          <Typography sx={{ mb: 2 }}>
            {address.line1}, {city.name}, {state.name} {address.postalCode},{" "}
            {country.name}
          </Typography>
        ) : (
          <Typography sx={{ mb: 2 }}>N/A</Typography>
        )}
        <Typography variant="h3" sx={{ mb: 2 }}>
          Timezone:
        </Typography>
        <Typography sx={{ mb: 2 }}>{timezone ? timezone : "N/A"}</Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Parking:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {parkingDetail ? parkingDetail : "N/A"}
        </Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Box Office:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Phone:{" "}
          {boxOfficeInfo && boxOfficeInfo.phoneNumberDetail
            ? boxOfficeInfo.phoneNumberDetail
            : "N/A"}
          <br />
          Hours:{" "}
          {boxOfficeInfo && boxOfficeInfo.openHoursDetail
            ? boxOfficeInfo.openHoursDetail
            : "N/A"}
          <br />
          Payment:{" "}
          {boxOfficeInfo && boxOfficeInfo.acceptedPaymentDetail
            ? boxOfficeInfo.acceptedPaymentDetail
            : "N/A"}
          <br />
          Will Call:{" "}
          {boxOfficeInfo && boxOfficeInfo.willCallDetail
            ? boxOfficeInfo.willCallDetail
            : "N/A"}
        </Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Accessibility:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {accessibleSeatingDetail ? accessibleSeatingDetail : "N/A"}
        </Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Children:
        </Typography>
        <Typography sx={{ mb: 2 }}>{childRule ? childRule : "N/A"}</Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Rules:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {generalRule ? generalRule : "N/A"}
        </Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Upcoming Events:
        </Typography>
        {upcomingEvents && upcomingEvents.ticketmaster ? (
          <Typography sx={{ mb: 2 }}>
            {upcomingEvents.ticketmaster} upcoming events on{" "}
            <a
              color="#178577"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
             <strong>Ticketmaster </strong> 
            </a>
          </Typography>
        ) : (
          <Typography sx={{ mb: 2 }}>
            <strong>No upcoming events on Ticketmaster{" "} </strong>
          </Typography>
        )}
      </Box>

      <Button variant="contained" href={`/venues/page/1`}>
        Back to all Venues
      </Button>
      <br></br>
    </Card>
  );
};

const VenueDetails = () => {
  const [venue, setVenue] = useState();
  const [loading, setLoading] = useState(true);
  const [showsWrongPage, setShowsWrongPage] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    console.log(`on load useEffect for page ${id}`);
    const fetchVenue = async () => {
      try {
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/venues/${id}.json?apikey=${APIKEY}`
        );
        console.log("Got data");
        setVenue(response.data);
        setLoading(false);
      } catch (e) {
        setShowsWrongPage(true);
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  } else if (showsWrongPage || venue.length === 0) {
    if (!loading) {
      return (
        <div>
          <h1>404, Page not found!</h1>
          <br />
          <Button variant="contained" href={`/venues/page/1`}>
            Back to all Venues
          </Button>
        </div>
      );
    }
  } else {
    return (
      <div>
        <StyledTitle>
          <p>Venue Details</p>
        </StyledTitle>
        {buildVenue(venue)}
        <br></br>
      </div>
    );
  }
};

export default VenueDetails;
