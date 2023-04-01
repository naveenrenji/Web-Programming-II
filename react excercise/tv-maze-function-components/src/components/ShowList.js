import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SearchShows from "./SearchShows";
import noImage from "../img/download.jpeg";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

import "../App.css";

const ShowList = () => {
  const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [showsEOD, setShowsEOD] = useState(false);
  const [showsWrongPage, setShowsWrongPage] = useState(false);

  const [showsFirstPage, setShowsFirstPage] = useState(false);

  let { pageNum } = useParams();
  const [urlPage, seturlPage] = useState(pageNum);

  let card = null;
  const nextButton = () => {
    seturlPage(parseInt(urlPage) + 1);
  };
  const previousButton = () => {
    if (urlPage <= 0) {
      seturlPage(0);
    } else {
      seturlPage(parseInt(urlPage) - 1);
    }
  };

  const FirstPage = () => {
    seturlPage(0);
  };

  useEffect(() => {
    console.log("on load useeffect for page " + urlPage);
    setShowsEOD(false);
    setShowsWrongPage(false);
    async function fetchData() {
      try {
        const nextURL = `/shows/page/${urlPage}`;
        const nextTitle = "React page";
        const nextState = { additionalInformation: "Updated the URL with JS" };
        // This will create a new entry in the browser's history, without reloading
        window.history.pushState(nextState, nextTitle, nextURL);
        const { data } = await axios.get(
          `https://api.tvmaze.com/shows?page=${urlPage}`
        );
        try {
          await axios.get(
            `https://api.tvmaze.com/shows?page=${parseInt(urlPage) + 1}`
          );
        } catch (e) {
          if (e.code === "ERR_BAD_REQUEST") {
            setShowsEOD(true);
            setLoading(false);
          }
        }
        setShowsFirstPage(false);
        if(parseInt(urlPage)===0){
          setShowsFirstPage(true);
        }
        console.log("Got data");
        setShowsData(data);
        setLoading(false);
      } catch (e) {
        console.log("end of data");
        if (e.code === "ERR_BAD_REQUEST") {
          setShowsWrongPage(true);
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [urlPage]);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          "http://api.tvmaze.com/search/shows?q=" + searchTerm
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchData();
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={show.id}>
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
          }}
        >
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                sx={{
                  height: "100%",
                  width: "100%",
                }}
                component="img"
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title="show image"
              />

              <CardContent>
                <Typography
                  sx={{
                    borderBottom: "1px solid #178577",
                    fontWeight: "bold",
                  }}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {show.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {show.summary
                    ? show.summary.replace(regex, "").substring(0, 139) + "..."
                    : "No Summary"}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        let { show } = shows;
        return buildCard(show);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }
   else if (showsWrongPage) {
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
  }
  else {
    return (
      <div>
        <SearchShows searchValue={searchValue} />
        <br />
        <br />
        {!showsFirstPage && (
          <Button className="showlink" onClick={previousButton}>
            Previous Page
          </Button>
        )}
        {!showsEOD && (
          <Button className="showlink" onClick={nextButton}>
            Next Page
          </Button>
        )}
        <br />
        <br />
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {card}
        </Grid>
      </div>
    );
  }
};

export default ShowList;
