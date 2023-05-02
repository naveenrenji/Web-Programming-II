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
import Search from "@/components/Search";
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
        <Link href={`/attractions/${attraction.id}`}>
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
                attraction.images && attraction.images[0].url
                  ? attraction.images[0].url
                  : "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png?20210219185637"
              }
              title={attraction.name}
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
                {attraction.name}
              </Typography>
              {attraction.upcomingEvents &&
              attraction.upcomingEvents.ticketmaster ? (
                <Typography variant="body2" color="textSecondary" component="p">
                  `{attraction.upcomingEvents.ticketmaster} upcoming events on
                  Ticketmaster`
                  <br />
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary" component="p">
                  No upcoming events on Ticketmaster{" "}
                </Typography>
              )}
            </CardContent>
          </Box>
        </Link>
      </Card>
    </Grid>
  );
};

const AttractionsListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [attractions, setAttractions] = useState([]);
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

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const FirstPage = () => {
    seturlPage(1);
  };

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/attractions.json?size=1&apikey=${APIKEY}&keyword=${searchTerm}`
        );
        setAttractions(data._embedded.attractions);
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
    setShowsEOD(false);
    setShowsWrongPage(false);
    const nextURL = `/attractions/page/${urlPage}`;
    const nextTitle = "Attractions page";
    const nextState = { additionalInformation: "Updated the URL with JS" };
    window.history.pushState(nextState, nextTitle, nextURL);
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
              page: urlPage - 1,
            },
          }
        );
        setShowsFirstPage(parseInt(urlPage) === 1);
        setAttractions(response.data._embedded.attractions);
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
      fetchAttractions();
      setShowsEOD(true);
      setLoading(false);
    } else {
      if (searchTerm.trim().length === 0) {
        fetchAttractions();
      }
    }
  }, [urlPage, searchTerm]);

  if (searchTerm) {
    return (
      <div>
        <StyledTitle>
          <span>Attractions Listing</span>
        </StyledTitle>
        <Search searchValue={searchValue} />
        <br></br>
        {attractions.map((attraction) => buildCard(attraction))}
        <br></br>
      </div>
    );
  } else if (loading) {
    return (
      <div>
        <span>Loading....</span>
      </div>
    );
  } else if (showsWrongPage || attractions.length === 0) {
    if (!loading) {
      return (
        <div>
          <h1>404, No Attractions Found!</h1>
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
          <span>Attractions Listing</span>
        </StyledTitle>
        <Search searchValue={searchValue} />
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
          {attractions.map((attraction) => buildCard(attraction))}
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

export default AttractionsListing;
