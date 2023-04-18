import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";


const LocationListItem = ({ location, onLike, onRemoveLike, onDelete }) => {
  const buildCard = (location) => {
    return (
      <Grid item xs={12} sm={4} md={4} lg={3} xl={3} key={location.id}>
        <Card
          key={location.id}
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
          <CardMedia
            sx={{
              height: "100%",
              width: "100%",
            }}
            component="img"
            image={location.image}
            title={location.name}
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
              {location.name}
            </Typography>
            {location.address && (
              <Typography variant="body2" color="textSecondary" component="p">
                {location.address}
              </Typography>
            )}
            <Button
              onClick={() =>
                location.liked ? onRemoveLike(location) : onLike(location)
              }
            >
              {location.liked ? "Remove Like" : "Like"}
            </Button>
            {onDelete && (
              <Button onClick={() => onDelete(location)}>Delete</Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return <div>{buildCard(location)}</div>;
};

export default LocationListItem;
