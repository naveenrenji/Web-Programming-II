import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  ListItem,
  Typography,
} from "@mui/material";
import noImage from '../img/download.jpeg';
import { Link, useParams } from "react-router-dom";

const APIKEY = "mWzS1KYw6kPb4fA0KJBqNXDAF0hUqI6A";

const buildCard = (venue) => {
    return (
        <CardActionArea>
        <Link to={`/venues/${venue.id}`}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginY: 2,
            padding: 2,
            borderRadius: 5,
            border: '1px solid #1e8678',
            boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
          }}
        >
          <img
            src={venue.images && venue.images[0].url ? venue.images[0].url : noImage}
            alt={venue.name}
            style={{
              height: 100,
              width: 100,
              borderRadius: 5,
              marginRight: 2,
            }}
          />
          <Box sx={{ flexGrow: 1, marginLeft: 2 }}>
            <Link to={`/venues/${venue.id}`}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  marginBottom: 1,
                }}
                variant="h6"
                component="h3"
              >
                {venue.name}
              </Typography>
              <Typography>
                {venue.upcomingEvents.ticketmaster
                  ? `${venue.upcomingEvents.ticketmaster} upcoming events on Ticketmaster`
                  : 'No upcoming events on Ticketmaster'}
              </Typography>
            </Link>
          </Box>
        </Box>
        </Link>
        </CardActionArea>
      );
      
      
};

const VenuesListing = () => {
  const [venues, setVenues] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showsEOD, setShowsEOD] = useState(false);
  const [showsWrongPage, setShowsWrongPage] = useState(false);
  const [showsFirstPage, setShowsFirstPage] = useState(false);
  let { pageNum } = useParams();
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

  useEffect(() => {
    console.log(`on load useEffect for page ${urlPage}`);
    setShowsEOD(false);
    setShowsWrongPage(false);
    const fetchVenues = async () => {
      try {
        const nextURL = `/venues/page/${urlPage}`;
        const nextTitle = "venues page";
        const nextState = { additionalInformation: "Updated the URL with JS" };
        window.history.pushState(nextState, nextTitle, nextURL);
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/venues`,
          {
            params: {
              apikey: APIKEY,
              countryCode: "US",
              page: urlPage,
            },
          }
        );
        // try {
        //   await axios.get(`https://app.ticketmaster.com/discovery/v2/venues`, {
        //     params: {
        //       apikey: APIKEY,
        //       countryCode: "US",
        //       page: parseInt(urlPage) + 1,
        //     },
        //   });
        // } catch (e) {
        //   if (e.code === "ERR_BAD_REQUEST") {
        //     setShowsEOD(true);
        //     setLoading(false);
        //   }
        // }
        setShowsFirstPage(parseInt(urlPage) === 1);
        console.log("Got data");
        setVenues(response.data._embedded.venues);
        setTotalPages(response.data.page.totalPages);
        console.log(`URL number = ${urlPage}`);
        console.log(`total pages = ${totalPages}`);
        setLoading(false);
      } catch (e) {
        console.log("end of data");
        setShowsWrongPage(true);
        setLoading(false);
      }
    };

    fetchVenues();
  }, [urlPage]);

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
        <br />
        <Button className="showlink" onClick={FirstPage}>
          Go to First Page
        </Button>
        <br />
        <br />
      </div>
    );
  } else {
    return (
      <div>
        <h2>Venues Listing</h2>
        <div>
          {!showsFirstPage && (
            <Button className="showlink" onClick={handlePrevPage}>
              Previous Page
            </Button>
          )}
          {!showsEOD && (
            <Button className="showlink" onClick={handleNextPage}>
              Next Page
            </Button>
          )}
        </div>
        <br></br>
        <Grid container spacing={2}
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginY: 2,
            padding: 2,
            borderRadius: 5,
            border: '1px solid #1e8678',
            boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
          }}>
          {venues.map((venue) => buildCard(venue))}
        </Grid>
        <br></br>
        <div>
          {!showsFirstPage && (
            <Button className="showlink" onClick={handlePrevPage}>
              Previous Page
            </Button>
          )}
          {!showsEOD && (
            <Button className="showlink" onClick={handleNextPage}>
              Next Page
            </Button>
          )}
        </div>
        <br></br>
      </div>
    );
  }
};

export default VenuesListing;
