import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
const APIKEY = "mWzS1KYw6kPb4fA0KJBqNXDAF0hUqI6A";

const buildEvent = (eventdata) => {
  return (
    <Card
      key={eventdata.id}
      variant="outlined"
      sx={{
        maxWidth: 450,
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
          border: "1px solid #1e8678",
          boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
        }}
        component="img"
        image={eventdata.images[0].url}
        title={eventdata.name}
      />
      <CardContent>
        <br></br>
        <Typography
          sx={{
            borderBottom: "1px solid #1e8678",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textAlign: "center",
          }}
          gutterBottom
          component="h3"
        >
          {eventdata.name}
        </Typography>
        <br></br>
        {eventdata.priceRanges && (
          <>
            <Typography variant="body2" color="textSecondary" component="p">
              Price Range ${eventdata.priceRanges[0].min} - $
              {eventdata.priceRanges[0].max}
            </Typography>
            <br></br>
          </>
        )}
        {!eventdata.priceRanges && (
          <>
            <Typography variant="body2" color="textSecondary" component="p">
              Price Range Not Available
            </Typography>
            <br></br>
          </>
        )}
        {eventdata.dates.start.localDate && (
          <>
            <Typography variant="body2" color="textSecondary" component="p">
              Start Date - {eventdata.dates.start.localDate}
            </Typography>
            <br></br>
          </>
        )}
        {eventdata.classifications && (
          <>
            <Typography variant="body2" color="textSecondary" component="p">
              Genre - {eventdata.classifications[0].genre.name}
            </Typography>
            <br></br>
          </>
        )}
        {eventdata.classifications && (
          <>
            <Typography variant="body2" color="textSecondary" component="p">
              Segment - {eventdata.classifications[0].segment.name}
            </Typography>
            <br></br>
          </>
        )}
        {eventdata.venues && (
          <>
            <Typography variant="body2" color="textSecondary" component="p">
              Venue Name - {eventdata.venues[0].name}
            </Typography>
            <br></br>
          </>
        )}
        {eventdata.venues && (
          <>
            <Typography variant="body2" color="textSecondary" component="p">
              Venue State - {eventdata.venues[0].state}
            </Typography>
            <br></br>
          </>
        )}
        {eventdata.venues && (
          <>
            <Typography variant="body2" color="textSecondary" component="p">
              Venue Address - {eventdata.venues[0].address}
            </Typography>
            <br></br>
          </>
        )}
        <Button variant="contained" href={`/events/page/1`}>
          Back to all events
        </Button>
      </CardContent>
    </Card>
  );
};

const EventDetails = () => {
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(true);
  const [showsWrongPage, setShowsWrongPage] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    console.log(`on load useEffect for page ${id}`);
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=mWzS1KYw6kPb4fA0KJBqNXDAF0hUqI6A`
        );
        console.log("Got data");
        setEvent(response.data);
        setLoading(false);
      } catch (e) {
          setShowsWrongPage(true);
        setLoading(false);
      }
    };
    fetchEvent();
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
        <Button variant="contained" href={`/events/page/1`}>
          Back to all events
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Event Details</h2>
        {buildEvent(event)}
        <br></br>
      </div>
    );
  }
};

export default EventDetails;
