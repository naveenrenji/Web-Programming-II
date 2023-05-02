import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, CardMedia, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Search from "@/components/Search";
import Link from "next/link";
import { useRouter } from "next/router";

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

const buildCard = (venue) => {
  return (
    <Link key={venue.id} href={`/venues/${venue.id}`}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginY: 2,
          padding: 2,
          borderRadius: 5,
          border: "1px solid #178577",
          boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
          transition: "transform 0.3s ease-out",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
            borderColor: "#178577",
          },
        }}
      >
        <CardMedia
          sx={{
            height: 100,
            width: 100,
            borderRadius: 5,
            marginRight: 2,
          }}
          component="img"
          image={
            venue.images && venue.images[0].url
              ? venue.images[0].url
              : "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png?20210219185637"
          }
          title={venue.name}
        />

        <Box sx={{ flexGrow: 1, marginLeft: 2 }}>
          <Typography
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
            }}
            variant="h6"
            component="h2"
            color="#178577"
          >
            {venue.name}
          </Typography>
          {venue.upcomingEvents && venue.upcomingEvents.ticketmaster ? (
            <Typography variant="body2" color="textSecondary" component="p">
              `{venue.upcomingEvents.ticketmaster} upcoming events on
              Ticketmaster`
              <br />
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary" component="p">
              No upcoming events on Ticketmaster{" "}
            </Typography>
          )}
        </Box>
      </Box>
    </Link>
  );
};

const VenuesListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState([]);
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
          `https://app.ticketmaster.com/discovery/v2/venues.json?size=1&apikey=${APIKEY}&keyword=${searchTerm}`
        );
        setVenues(data._embedded.venues);
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
    const nextURL = `/venues/page/${urlPage}`;
    const nextTitle = "venues page";
    const nextState = { additionalInformation: "Updated the URL with JS" };
    window.history.pushState(nextState, nextTitle, nextURL);
    const fetchVenues = async () => {
      try {
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/venues`,
          {
            params: {
              apikey: APIKEY,
              countryCode: "US",
              page: urlPage - 1,
            },
          }
        );
        setShowsFirstPage(parseInt(urlPage) === 1);
        setVenues(response.data._embedded.venues);
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
      fetchVenues();
      setShowsEOD(true);
      setLoading(false);
    } else {
      if (searchTerm.trim().length === 0) {
        fetchVenues();
      }
    }
  }, [urlPage, searchTerm]);

  if (searchTerm) {
    return (
      <div>
        <StyledTitle>
          <span>Venues Listing</span>
        </StyledTitle>
        <Search searchValue={searchValue} />
        <br></br>
        {venues.map((venue) => buildCard(venue))}
        <br></br>
      </div>
    );
  } else if (loading) {
    return (
      <div>
        <span>Loading....</span>
      </div>
    );
  } else if (showsWrongPage || venues.length === 0) {
    if (!loading) {
      return (
        <div>
          <h1>404, No Venues Found!</h1>
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
          <span>Venues Listing</span>
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
        <Box sx={{ width: "50%", margin: "0 auto" }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginY: 2,
              padding: 2,
              borderRadius: 5,
              border: "2px solid #178577",
              backgroundColor: "#fff",
              boxShadow: "0 5px 5px rgba(0, 0, 0, 0.15)",
            }}
          >
            {venues.map((venue) => buildCard(venue))}
          </Grid>
          <br></br>
        </Box>
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
      </div>
    );
  }
};

export default VenuesListing;
