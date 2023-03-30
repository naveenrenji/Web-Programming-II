import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";

const APIKEY = "mWzS1KYw6kPb4fA0KJBqNXDAF0hUqI6A";

const buildCard = (event) => {
  return (
    <Grid item xs={12} sm={4} md={4} lg={3} xl={3} key={event.id}>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 250,
          height: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 5,
          border: "1px solid #1e8678",
          boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
        }}
      >
        <CardActionArea>
          <Link to={`/events/${event.id}`}>
            <CardMedia
              sx={{
                height: "100%",
                width: "100%",
              }}
              component="img"
              image={event.images[0].url}
              title={event.name}
            />

            <CardContent>
              <Typography
                sx={{
                  borderBottom: "1px solid #1e8678",
                  fontWeight: "bold",
                }}
                gutterBottom
                variant="h6"
                component="h3"
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
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

const EventsListing = () => {
  const [events, setEvents] = useState([]);
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
    const fetchEvents = async () => {
      try {
        const nextURL = `/events/page/${urlPage}`;
        const nextTitle = "Events page";
        const nextState = { additionalInformation: "Updated the URL with JS" };
        window.history.pushState(nextState, nextTitle, nextURL);
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events`,
          {
            params: {
              apikey: APIKEY,
              countryCode: "US",
              page: urlPage,
            },
          }
        );
        // try {
        //   await axios.get(`https://app.ticketmaster.com/discovery/v2/events`, {
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
        setEvents(response.data._embedded.events);
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

    fetchEvents();
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
        <h2>Events Listing</h2>
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
        <Grid container spacing={2}>
          {events.map((event) => buildCard(event))}
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

export default EventsListing;
