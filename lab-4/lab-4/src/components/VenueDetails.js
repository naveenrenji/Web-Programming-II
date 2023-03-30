import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
} from "@mui/material";
import noImage from "../img/download.jpeg";

const APIKEY = "mWzS1KYw6kPb4fA0KJBqNXDAF0hUqI6A";

const buttonStyle = {
  borderBottom: "1px solid #1e8678",
  fontWeight: "bold",
  fontSize: "1.0rem",
  textAlign: "center",
  margin: "10px",
  color: "white",
};

const infoStyle = {
  height: "100%",
  width: "100%",
  borderRadius: 5,
  fontWeight: "bold",
  fontSize: "0.8rem",
  textAlign: "center",
  border: "1px solid #1e8678",
  boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
};

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
        border: "1px solid #1e8678",
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
          border: "1px solid #1e8678",
          boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
        }}
        component="img"
        image={images && images[0].url ? images[0].url : noImage}
        title={name}
      />
      <br></br>
      <Box sx={{ maxWidth: 600, mx: "auto", px: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {name}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Address:
        </Typography>
        {address ? (
          <Typography sx={{ mb: 2 }}>
            {address.line1}, {city.name}, {state.name} {address.postalCode},{" "}
            {country.name}
          </Typography>
        ) : (
          "N/A"
        )}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Timezone:
        </Typography>
        <Typography sx={{ mb: 2 }}>{timezone ? timezone : "N/A"}</Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Parking:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {parkingDetail ? parkingDetail : "N/A"}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Box Office:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Phone:{" "}
          {boxOfficeInfo.phoneNumberDetail
            ? boxOfficeInfo.phoneNumberDetail
            : "N/A"}
          <br />
          Hours:{" "}
          {boxOfficeInfo.openHoursDetail
            ? boxOfficeInfo.openHoursDetail
            : "N/A"}
          <br />
          Payment:{" "}
          {boxOfficeInfo.acceptedPaymentDetail
            ? boxOfficeInfo.acceptedPaymentDetail
            : "N/A"}
          <br />
          Will Call:{" "}
          {boxOfficeInfo.willCallDetail ? boxOfficeInfo.willCallDetail : "N/A"}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Accessibility:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {accessibleSeatingDetail ? accessibleSeatingDetail : "N/A"}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Children:
        </Typography>
        <Typography sx={{ mb: 2 }}>{childRule ? childRule : "N/A"}</Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Rules:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {generalRule ? generalRule : "N/A"}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upcoming Events:
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {upcomingEvents.ticketmaster ? upcomingEvents.ticketmaster : 0}{" "}
          upcoming events on{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            Ticketmaster
          </a>
        </Typography>
      </Box>
      <Button variant="contained" href={`/venues/page/1`}>
          Back to all Venues
        </Button>
        <br></br>
    </Card>

    // <Card
    //   key={venueData.id}
    //   variant="outlined"
    //   sx={{
    //     maxWidth: 450,
    //     mx: "auto",
    //     borderRadius: 5,
    //     border: "1px solid #1e8678",
    //     boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
    //     display: "flex",
    //     flexDirection: "column",
    //     alignItems: "center",
    //   }}
    // >
    //   <br></br>
    //   <CardMedia
    //     sx={{
    //       height: "70%",
    //       width: "70%",
    //       borderRadius: 5,
    //       fontWeight: "bold",
    //       fontSize: "1.5rem",
    //       textAlign: "center",
    //       border: "1px solid #1e8678",
    //       boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
    //     }}
    //     component="img"
    //     image={venueData.images[0].url}
    //     title={venueData.name}
    //   />
    //   <CardContent>
    //     <br></br>
    //     <Typography
    //       sx={{
    //         borderBottom: "1px solid #1e8678",
    //         fontWeight: "bold",
    //         fontSize: "1.2rem",
    //         textAlign: "center",
    //       }}
    //       gutterBottom
    //       component="h3"
    //     >
    //       {venueData.name}
    //     </Typography>
    //     <br></br>
    //     {venueData.classifications[0].genre && (
    //       <>
    //         <Typography
    //           sx={infoStyle}
    //           variant="body2"
    //           color="textSecondary"
    //           component="p"
    //         >
    //           Genre - {venueData.classifications[0].genre.name}
    //         </Typography>
    //         <br></br>
    //       </>
    //     )}
    //             {venueData.classifications[0].subGenre && (
    //       <>
    //         <Typography
    //           sx={infoStyle}
    //           variant="body2"
    //           color="textSecondary"
    //           component="p"
    //         >
    //           subGenre - {venueData.classifications[0].subGenre.name}
    //         </Typography>
    //         <br></br>
    //       </>
    //     )}
    //     {venueData.classifications[0].segment && (
    //       <>
    //         <Typography
    //           sx={infoStyle}
    //           variant="body2"
    //           color="textSecondary"
    //           component="p"
    //         >
    //           Segment - {venueData.classifications[0].segment.name}
    //         </Typography>
    //         <br></br>
    //       </>
    //     )}
    //     {venueData.classifications[0].subType && (
    //       <>
    //         <Typography
    //           sx={infoStyle}
    //           variant="body2"
    //           color="textSecondary"
    //           component="p"
    //         >
    //           Subtype - {venueData.classifications[0].subType.name}
    //         </Typography>
    //         <br></br>
    //       </>
    //     )}
    //     {venueData.classifications[0].type && (
    //       <>
    //         <Typography
    //           sx={infoStyle}
    //           variant="body2"
    //           color="textSecondary"
    //           component="p"
    //         >
    //           Type - {venueData.classifications[0].type.name}
    //         </Typography>
    //         <br></br>
    //       </>
    //     )}
    //     {venueData.externalLinks && (
    //       <>
    //         {venueData.externalLinks.homepage[0].url && (
    //           <>
    //             <Button
    //               sx={buttonStyle}
    //               variant="contained"
    //               href={venueData.externalLinks.homepage[0].url}
    //             >
    //               Website - {venueData.name}
    //             </Button>
    //             <br></br>
    //           </>
    //         )}
    //         {venueData.externalLinks.instagram[0].url && (
    //           <>
    //             <Button
    //               sx={buttonStyle}
    //               variant="contained"
    //               href={venueData.externalLinks.instagram[0].url}
    //             >
    //               Instagram - {venueData.name}
    //             </Button>
    //             <br></br>
    //           </>
    //         )}
    //         {venueData.externalLinks.twitter[0].url && (
    //           <>
    //             <Button
    //               sx={buttonStyle}
    //               variant="contained"
    //               href={venueData.externalLinks.twitter[0].url}
    //             >
    //               Twitter - {venueData.name}
    //             </Button>
    //             <br></br>
    //           </>
    //         )}
    //         {venueData.externalLinks.facebook[0].url && (
    //           <>
    //             <Button
    //               sx={buttonStyle}
    //               variant="contained"
    //               href={venueData.externalLinks.facebook[0].url}
    //             >
    //               Facebook - {venueData.name}
    //             </Button>
    //             <br></br>
    //           </>
    //         )}
    //         {venueData.externalLinks.spotify && (
    //           <>
    //             <Button
    //               sx={buttonStyle}
    //               variant="contained"
    //               href={venueData.externalLinks.spotify[0].url}
    //             >
    //               Spotify - {venueData.name}
    //             </Button>
    //             <br></br>
    //           </>
    //         )}
    //         {venueData.externalLinks.wiki && (
    //           <>
    //             <Button
    //               sx={buttonStyle}
    //               variant="contained"
    //               href={venueData.externalLinks.wiki[0].url}
    //             >
    //               Wiki - {venueData.name}
    //             </Button>
    //             <br></br>
    //           </>
    //         )}
    //       </>
    //     )}
    //     <br></br>
    //     <Button variant="contained" href={`/venues/page/1`}>
    //       Back to all venues
    //     </Button>
    //   </CardContent>
    // </Card>
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
          `https://app.ticketmaster.com/discovery/v2/venues/${id}.json?apikey=mWzS1KYw6kPb4fA0KJBqNXDAF0hUqI6A`
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
        <h2>Loading....</h2>
      </div>
    );
  } else if (showsWrongPage) {
    return (
      <div>
        <h1>404, Page not found!</h1>
        <br />
        <Button variant="contained" href={`/venues/page/1`}>
          Back to all Venues
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Venue Details</h2>
        {buildVenue(venue)}
        <br></br>
      </div>
    );
  }
};

export default VenueDetails;
