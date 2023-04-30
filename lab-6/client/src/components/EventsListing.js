import React, { useState, useEffect, useContext } from "react";
import { CollectorContext } from "./CollectorContext";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { styled } from "@mui/system";
import { keyframes } from "@emotion/react";
import Search from "./Search";
import noImage from "../img/download.jpeg";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledTitle = styled("h1")({
  fontFamily: "'Bangers', cursive",
  fontWeight: 800,
  fontSize: "3rem",
  color: "#ec0d19",
  marginBottom: "2rem",
  textAlign: "center",
  animation: `${fadeIn} 1s ease-in`,
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

const CollectButtons = ({ character }) => {
  const {
    collectors,
    selectedCollector,
    addCharacterToCollector,
    removeCharacterFromCollector,
  } = useContext(CollectorContext);

  const handleCollectClick = () => {
    if (selectedCollector !== null) {
      addCharacterToCollector(selectedCollector, character);
    } else {
      alert("select a collection first");
    }
  };

  const handleGiveUpClick = () => {
    const collector = collectors[selectedCollector];
    const characterIndex = collector.characters.findIndex(
      (c) => c.id === character.id
    );

    if (characterIndex !== -1) {
      removeCharacterFromCollector(selectedCollector, characterIndex);
    }
  };

  const isCharacterCollected = () => {
    if (selectedCollector !== null) {
      return collectors[selectedCollector].characters.some(
        (collectedCharacter) => collectedCharacter.id === character.id
      );
    }
    return false;
  };

  // Render the buttons
  return (
    <div>
      {isCharacterCollected() ? (
        <Button
          sx={buttonStyle}
          variant="contained"
          onClick={handleGiveUpClick}
        >
          Give up
        </Button>
      ) : (
        <Button
          sx={buttonStyle}
          variant="contained"
          onClick={handleCollectClick}
        >
          Collect
        </Button>
      )}
    </div>
  );
};

const buildCard = (character) => {
  return (
    <Grid item xs={12} sm={4} md={4} lg={3} xl={3} key={character.id}>
      <Card
        key={character.id}
        variant="outlined"
        sx={{
          maxWidth: 250,
          height: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 5,
          border: "1px solid #ec0d19",
          boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          transition: "transform 0.3s ease-out",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
            borderColor: "#ec0d19",
          },
        }}
      >
        <CollectButtons character={character} />
        <Link
          to={`/character/${character.id}`}
          style={{ textDecoration: "none" }}
        >
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
                height: 250, // Fixed height for CardMedia
                width: "100%",
                objectFit: "cover", // Scale the image appropriately within the fixed height
              }}
              component="img"
              image={character.image ? character.image : noImage}
              title={character.name}
            />
            <CardContent
              sx={{
                height: 60, // Fixed height for CardContent
              }}
            >
              <Typography
                sx={{
                  borderBottom: "1px solid #ec0d19",
                  fontWeight: "bold",
                  color: "#ec0d19",
                }}
                gutterBottom
                variant="h6"
                component="h2"
              >
                {character.name}
              </Typography>
            </CardContent>
          </Box>
        </Link>
      </Card>
    </Grid>

    //   // <Card
    //   //   key={character.id}
    //   //   variant="outlined"
    //   //   sx={{
    //   //     maxWidth: 250,
    //   //     height: "auto",
    //   //     marginLeft: "auto",
    //   //     marginRight: "auto",
    //   //     borderRadius: 5,
    //   //     border: "1px solid #ec0d19",
    //   //     boxShadow:
    //   //       "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
    //   //     transition: "transform 0.3s ease-out",
    //   //     "&:hover": {
    //   //       transform: "scale(1.03)",
    //   //       boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
    //   //       borderColor: "#ec0d19",
    //   //     },
    //   //   }}
    //   // >
    //   //   <CollectButtons character={character} />
    //   //   <Link to={`/character/${character.id}`}>
    //   //   <CardActionArea>
    //   //       <CardMedia
    //   //         sx={{
    //   //           height: 250, // Fixed height for CardMedia
    //   //           width: "100%",
    //   //           objectFit: "cover", // Scale the image appropriately within the fixed height
    //   //         }}
    //   //         component="img"
    //   //         image={character.image ? character.image : noImage}
    //   //         title={character.name}
    //   //       />

    //   //       <CardContent
    //   //         sx={{
    //   //           height: 60, // Fixed height for CardContent
    //   //         }}
    //   //       >
    //   //         <Typography
    //   //           sx={{
    //   //             borderBottom: "1px solid #ec0d19",
    //   //             fontWeight: "bold",
    //   //             color: "#ec0d19",
    //   //           }}
    //   //           gutterBottom
    //   //           variant="h6"
    //   //           component="h2"
    //   //         >
    //   //           {character.name}
    //   //         </Typography>
    //   //       </CardContent>
    //   //   </CardActionArea>
    //   //   </Link>
    //   // </Card>
    // </Grid>
  );
};

const EventsListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
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

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          ` http://localhost:8000/character/search/${searchTerm}`
        );
        setEvents(data);
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
    const nextURL = `/marvel-characters/page/${urlPage}`;
    const nextTitle = "marvel-characters page";
    const nextState = { additionalInformation: "Updated the URL with JS" };
    window.history.pushState(nextState, nextTitle, nextURL);
    setLoading(true);
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/marvel-characters/page/${urlPage}`
        );
        setShowsFirstPage(parseInt(urlPage) === 1);
        setEvents(response.data);
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
    if (urlPage - 1 === 80) {
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
        <StyledTitle>Marvel Characters Listing</StyledTitle>
        <Search searchValue={searchValue} />
        <br></br>
        <Grid container spacing={2}>
          {events.map((event) => buildCard(event))}
        </Grid>
        <br></br>
      </div>
    );
  } else if (loading) {
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  } else if (showsWrongPage || events.length === 0) {
    if (!loading) {
      return (
        <div>
          <h1>404, No More Charcaters Found!</h1>
          <br />
          <br />
          <Button
            sx={buttonStyle}
            variant="contained"
            className="showlink"
            onClick={FirstPage}
          >
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
          <span>Marvel Characters Listing</span>
        </StyledTitle>
        <Search searchValue={searchValue} />
        <br></br>
        <div>
          {!showsFirstPage && (
            <Button
              sx={buttonStyle}
              variant="contained"
              className="showlink"
              onClick={handlePrevPage}
            >
              Previous Page
            </Button>
          )}
          {!showsEOD && (
            <Button
              sx={buttonStyle}
              variant="contained"
              className="showlink"
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
              className="showlink"
              onClick={handlePrevPage}
            >
              Previous Page
            </Button>
          )}
          {!showsEOD && (
            <Button
              sx={buttonStyle}
              variant="contained"
              className="showlink"
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
