import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { styled } from "@mui/system";
import Search from "@/components/Search";
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
  borderBottom: "1px solid #ED1D24",
  fontWeight: "bold",
  fontSize: "1.0rem",
  textAlign: "center",
  margin: "10px",
  backgroundColor: "#006ec8",
  color: "#f0f0f0",
  "&:hover": {
    backgroundColor: "#ED1D24",
  },
};

const buildCard = (event) => {
  return (
    <Grid item xs={12} sm={4} md={4} lg={3} xl={3} key={event.id}>
      <Card
        key={event.id}
        variant="outlined"
        sx={{
          maxWidth: 250,
          height: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 5,
          border: "1px solid #178577",
          boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          transition: "transform 0.3s ease-out",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
            borderColor: "#178577",
          },
        }}
      >
        <Link href={`/events/${event.id}`}>
          <Box
            component="div"
            sx={{
              cursor: "pointer", // Add cursor:pointer to keep the button-like behavior
              "&:hover": {
                // Move the hover styles from Card to this Box
                transform: "scale(1.03)",
                boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
                borderColor: "#ec0d19",
              },
            }}
          >
            <CardMedia
              sx={{
                height: "100%",
                width: "100%",
              }}
              component="img"
              image={
                event.images && event.images[0].url
                  ? event.images[0].url
                  : "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png?20210219185637"
              }
              title={event.name}
            />

            <CardContent>
              <Typography
                sx={{
                  borderBottom: "1px solid #178577",
                  fontWeight: "bold",
                  color: "#178577",
                }}
                gutterBottom
                variant="h6"
                component="h2"
              >
                {event.name}
              </Typography>
              {event.priceRanges && (
                <Typography variant="body2" color="textSecondary" component="p">
                  ${event.priceRanges[0].min} - ${event.priceRanges[0].max}
                </Typography>
              )}
              {!event.priceRanges && (
                <Typography variant="body2" color="textSecondary" component="p">
                  Price Range Not Available
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary" component="p">
                Start Date - {event.dates.start.localDate}
              </Typography>
              {event._embedded && event._embedded.venues ? (
                <Typography variant="body2" color="textSecondary" component="p">
                  Venues - {event._embedded.venues[0].name}
                  <br />
                  {event._embedded.venues[0].city.name}
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary" component="p">
                  Venue Not Available
                </Typography>
              )}
            </CardContent>
          </Box>
        </Link>
      </Card>
    </Grid>
  );
};

const EventsListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsEOD, setShowsEOD] = useState(false);
  const [showsWrongPage, setShowsWrongPage] = useState(false);
  const [showsFirstPage, setShowsFirstPage] = useState(false);
  const router = useRouter();
  const pageNum = router.query.id || 1;
  const [urlPage, seturlPage] = useState(pageNum);

  const handleNextPage = () => {
    seturlPage(parseInt(urlPage) + 1);
  };
  const handlePrevPage = () => {
    if (urlPage <= 1) {
      seturlPage(1);
    } else {
      seturlPage(parseInt(urlPage) - 1);
    }
  };

  const FirstPage = () => {
    seturlPage(1);
  };

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=${APIKEY}&keyword=${searchTerm}`
        );
        setEvents(data._embedded.events);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm.trim().length > 0) {
      fetchData();
    }
  }, [searchTerm]);

  useEffect(() => {
    console.log(`on load useEffect for page ${urlPage}`);
    setShowsEOD(false);
    setShowsWrongPage(false);
    const nextURL = `/events/page/${urlPage}`;
    const nextTitle = "Events page";
    const nextState = { additionalInformation: "Updated the URL with JS" };
    window.history.pushState(nextState, nextTitle, nextURL);
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events`,
          {
            params: {
              apikey: APIKEY,
              countryCode: "US",
              page: urlPage - 1,
            },
          }
        );
        setShowsFirstPage(parseInt(urlPage) === 1);
        setEvents(response.data._embedded.events);
        setLoading(false);
      } catch (e) {
        if (e.code === "ERR_NETWORK") {
          setShowsWrongPage(false);
          setLoading(false);
        } else {
          setShowsWrongPage(true);
          setLoading(false);
        }
      }
    };
    if (urlPage - 1 === 49) {
      fetchEvents();
      setShowsEOD(true);
      setLoading(false);
    } else {
      if (searchTerm.trim().length === 0) {
        fetchEvents();
      }
    }
  }, [urlPage, searchTerm]);

  if (searchTerm) {
    return (
      <div>
        <StyledTitle>
          <span>Events Listing</span>
        </StyledTitle>
        <Search searchValue={searchValue} />
        <br></br>
        {events.map((event) => buildCard(event))}
        <br></br>
      </div>
    );
  } else if (loading) {
    return (
      <div>
        <span>Loading....</span>
      </div>
    );
  } else if (showsWrongPage || events.length === 0) {
    if (!loading) {
      return (
        <div>
          <h1>404, No Events Found!</h1>
          <br />
          <br />
          <Button className="showlink" onClick={FirstPage}>
            Go to First Page
          </Button>
          <br />
          <br />
        </div>
      );
    }
  } else {
    return (
      <div>
        <StyledTitle>
          <span>Events Listing</span>
        </StyledTitle>
        <Search searchValue={searchValue} />
        <br></br>
        <div>
          {!showsFirstPage && (
            <Button
              sx={buttonStyle}
              variant="contained"
              onClick={handlePrevPage}
            >
              Previous Page
            </Button>
          )}
          {!showsEOD && (
            <Button
              sx={buttonStyle}
              variant="contained"
              onClick={handleNextPage}
            >
              Next Page
            </Button>
          )}
        </div>
        <br></br>
        <Grid container spacing={2}>
          {events.map((event) => buildCard(event))}
        </Grid>
        <br></br>
        <div>
          {!showsFirstPage && (
            <Button
              sx={buttonStyle}
              variant="contained"
              onClick={handlePrevPage}
            >
              Previous Page
            </Button>
          )}
          {!showsEOD && (
            <Button
              sx={buttonStyle}
              variant="contained"
              onClick={handleNextPage}
            >
              Next Page
            </Button>
          )}
        </div>
        <br></br>
      </div>
    );
  }
};

export default EventsListing;
