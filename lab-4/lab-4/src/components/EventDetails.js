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

const buildEvent = (eventdata) => {
  return (
    <Card
      key={eventdata.id}
      variant="outlined"
      sx={{
        maxWidth: 850,
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
          border: "1px solid #178577",
          boxShadow: "0 5px 5px rgba(0,0,0,0.30), 0 5px 5px rgba(0,0,0,0.22)",
        }}
        component="img"
        image={eventdata.images[0].url}
        title={eventdata.name}
      />
      <CardContent>
        <br></br>
        <div className="event-header">
          <h1>{eventdata.name}</h1>
          {eventdata.dates.start.localDate && (
            <>
              <p className="event-date">{eventdata.dates.start.localDate}</p>
            </>
          )}
        </div>
        {eventdata.priceRanges && (
          <>
            <h2>
              Price Range ${eventdata.priceRanges[0].min} - $
              {eventdata.priceRanges[0].max}
            </h2>
          </>
        )}
        {!eventdata.priceRanges && (
          <>
            <h2>Price Range Not Available</h2>
          </>
        )}
        <p>Event Details</p>
        <ul>
          <li>
            {eventdata.promoter && eventdata.promoter.name && (
              <>
                <Typography variant="body2" color="textSecondary" component="p">
                  <strong>Promoter - </strong>
                  {eventdata.promoter.name}
                </Typography>
              </>
            )}
          </li>
          <li>
            {eventdata.classifications && (
              <>
                <Typography variant="body2" color="textSecondary" component="p">
                  <strong>Genre - </strong>
                  {eventdata.classifications[0].genre.name}
                </Typography>
              </>
            )}
          </li>
          <li>
            {eventdata.classifications && (
              <>
                <Typography variant="body2" color="textSecondary" component="p">
                  <strong>Segment - </strong>
                  {eventdata.classifications[0].segment.name}
                </Typography>
              </>
            )}
          </li>
          <li>
            {eventdata.ticketLimit && (
              <>
                {eventdata.ticketLimit.info && (
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <strong>Ticket Limit - </strong>
                      {eventdata.ticketLimit.info}
                    </Typography>
                  </>
                )}
              </>
            )}
          </li>
          <h3>Venue Details</h3>
          {eventdata._embedded && (
            <>
              <li>
                {eventdata._embedded.venues && (
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <strong>Name - </strong>{" "}
                      {eventdata._embedded.venues[0].name}
                    </Typography>
                  </>
                )}
              </li>
              <li>
                {eventdata._embedded.venues && (
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <strong>State -</strong>{" "}
                      {eventdata._embedded.venues[0].state.name} ,{" "}
                      {eventdata._embedded.venues[0].state.stateCode}
                    </Typography>
                  </>
                )}
              </li>
              <li>
                {eventdata._embedded.venues && (
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <strong>Address - </strong>{" "}
                      {eventdata._embedded.venues[0].address.line1}
                    </Typography>
                  </>
                )}
              </li>
              <li>
                {eventdata._embedded.venues && (
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <strong> Child Rules</strong> <br></br>
                      {eventdata._embedded.venues[0].generalInfo
                        ? eventdata._embedded.venues[0].generalInfo.childRule
                          ? eventdata._embedded.venues[0].generalInfo.childRule
                          : "N/A"
                        : "N/A"}
                    </Typography>
                  </>
                )}
              </li>
              <li>
                {eventdata._embedded.venues && (
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <strong> General Rules</strong> <br></br>
                      {eventdata._embedded.venues[0].generalInfo
                        ? eventdata._embedded.venues[0].generalInfo.generalRule
                          ? eventdata._embedded.venues[0].generalInfo
                              .generalRule
                          : "N/A"
                        : "N/A"}
                    </Typography>
                  </>
                )}
              </li>
            </>
          )}
        </ul>
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
          `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${APIKEY}`
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
        <p>Loading....</p>
      </div>
    );
  } else if (showsWrongPage || event.length === 0) {
    if (!loading) {
      return (
        <div>
          <h1>404, Page not found!</h1>
          <br />
          <Button variant="contained" href={`/events/page/1`}>
            Back to all events
          </Button>
        </div>
      );
    }
  } else {
    return (
      <div>
        <StyledTitle>
          <p>Event Details</p>
        </StyledTitle>
                {buildEvent(event)}
        <br></br>
      </div>
    );
  }
};

export default EventDetails;
