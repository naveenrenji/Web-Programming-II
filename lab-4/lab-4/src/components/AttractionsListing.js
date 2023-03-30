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

const buildCard = (attraction) => {
  return (
    <Grid item xs={12} sm={4} md={4} lg={3} xl={3} key={attraction.id}>
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
          <Link to={`/attractions/${attraction.id}`}>
            <CardMedia
              sx={{
                height: "100%",
                width: "100%",
              }}
              component="img"
              image={attraction.images[0].url}
              title={attraction.name}
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
                {attraction.name}
              </Typography>
              {attraction.upcomingEvents.ticketmaster && (
                <Typography variant="body2" color="textSecondary" component="p">
                  Upcoming Events - {attraction.upcomingEvents.ticketmaster}
                </Typography>
              )}
              {!attraction.upcomingEvents.ticketmaster && (
                <Typography variant="body2" color="textSecondary" component="p">
                  Upcoming Events - None
                </Typography>
              )}
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

const AttractionsListing = () => {
  const [attractions, setAttractions] = useState([]);
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
    const fetchAttractions = async () => {
      try {
        const nextURL = `/attractions/page/${urlPage}`;
        const nextTitle = "Attractions page";
        const nextState = { additionalInformation: "Updated the URL with JS" };
        window.history.pushState(nextState, nextTitle, nextURL);
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/attractions`,
          {
            params: {
              apikey: APIKEY,
              countryCode: "US",
              page: urlPage,
            },
          }
        );
        // try {
        //   await axios.get(`https://app.ticketmaster.com/discovery/v2/attractions`, {
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
        setAttractions(response.data._embedded.attractions);
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

    fetchAttractions();
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
        <h2>Attractions Listing</h2>
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
          {attractions.map((attraction) => buildCard(attraction))}
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

export default AttractionsListing;
