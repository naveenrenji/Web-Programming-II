import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
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
const buttonStyle = {
  borderBottom: "1px solid #178577",
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
  border: "1px solid #178577",
  boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
};

const buildAttraction = (attractionData) => {
  return (
    <Card
      key={attractionData.id}
      variant="outlined"
      sx={{
        maxWidth: 450,
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
        image={attractionData.images[0].url}
        title={attractionData.name}
      />
      <CardContent>
        <br></br>
        <Typography
          sx={{
            borderBottom: "1px solid #178577",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textAlign: "center",
          }}
          gutterBottom
          component="h2"
        >
          {attractionData.name}
        </Typography>
        <br></br>
        {attractionData.classifications[0] && (
          <>
            {attractionData.classifications[0].genre && (
              <>
                <Typography
                  sx={infoStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  Genre - {attractionData.classifications[0].genre.name}
                </Typography>
                <br></br>
              </>
            )}
            {attractionData.classifications[0].subGenre && (
              <>
                <Typography
                  sx={infoStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  subGenre - {attractionData.classifications[0].subGenre.name}
                </Typography>
                <br></br>
              </>
            )}
            {attractionData.classifications[0].segment && (
              <>
                <Typography
                  sx={infoStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  Segment - {attractionData.classifications[0].segment.name}
                </Typography>
                <br></br>
              </>
            )}
            {attractionData.classifications[0].subType && (
              <>
                <Typography
                  sx={infoStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  Subtype - {attractionData.classifications[0].subType.name}
                </Typography>
                <br></br>
              </>
            )}
            {attractionData.classifications[0].type && (
              <>
                <Typography
                  sx={infoStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  Type - {attractionData.classifications[0].type.name}
                </Typography>
                <br></br>
              </>
            )}
          </>
        )}
        {attractionData.externalLinks && (
          <>
            {attractionData.externalLinks.homepage[0].url && (
              <>
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  href={attractionData.externalLinks.homepage[0].url}
                >
                  Website - {attractionData.name}
                </Button>
                <br></br>
              </>
            )}
            {attractionData.externalLinks.instagram[0].url && (
              <>
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  href={attractionData.externalLinks.instagram[0].url}
                >
                  Instagram - {attractionData.name}
                </Button>
                <br></br>
              </>
            )}
            {attractionData.externalLinks.twitter[0].url && (
              <>
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  href={attractionData.externalLinks.twitter[0].url}
                >
                  Twitter - {attractionData.name}
                </Button>
                <br></br>
              </>
            )}
            {attractionData.externalLinks.facebook[0].url && (
              <>
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  href={attractionData.externalLinks.facebook[0].url}
                >
                  Facebook - {attractionData.name}
                </Button>
                <br></br>
              </>
            )}
            {attractionData.externalLinks.spotify && (
              <>
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  href={attractionData.externalLinks.spotify[0].url}
                >
                  Spotify - {attractionData.name}
                </Button>
                <br></br>
              </>
            )}
            {attractionData.externalLinks.wiki && (
              <>
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  href={attractionData.externalLinks.wiki[0].url}
                >
                  Wiki - {attractionData.name}
                </Button>
                <br></br>
              </>
            )}
          </>
        )}
        <br></br>
        <Button variant="contained" href={`/attractions/page/1`}>
          Back to all Attractions
        </Button>
      </CardContent>
    </Card>
  );
};

const AttractionDetails = () => {
  const [attraction, setAttraction] = useState();
  const [loading, setLoading] = useState(true);
  const [showsWrongPage, setShowsWrongPage] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    console.log(`on load useEffect for page ${id}`);
    const fetchAttraction = async () => {
      try {
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?apikey=${APIKEY}`
        );
        console.log("Got data");
        setAttraction(response.data);
        setLoading(false);
      } catch (e) {
        setShowsWrongPage(true);
        setLoading(false);
      }
    };
    fetchAttraction();
  }, [id]);

  if (loading) {
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  } else if (showsWrongPage || attraction.length === 0) {
    if (!loading) {
      return (
        <div>
          <h1>404, Page not found!</h1>
          <br />
          <Button variant="contained" href={`/attractions/page/1`}>
            Back to all Attractions
          </Button>
        </div>
      );
    }
  } else {
    return (
      <div>
        <StyledTitle>
          <p>Attraction Details</p>
        </StyledTitle>
        {buildAttraction(attraction)}
        <br></br>
      </div>
    );
  }
};

export default AttractionDetails;
