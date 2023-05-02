import React from "react";
import { Card, Typography } from "@mui/material";
import { styled } from "@mui/system";

const StyledContainer = styled('div')({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // justifyContent: "center",
  height: "80vh",
  backgroundColor: "#3f6553"
})

const StyledTitle = styled('h1')({
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 800,
  fontSize: "3rem",
  color: "white",
  marginBottom: "2rem",
  textAlign: "center"
})

const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "80%",
  padding: "2rem",
  borderRadius: "10px",
  boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
  backgroundColor: "white"
})

const StyledSubTitle = styled('h2')({
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 600,
  fontSize: "1.5rem",
  color: "#178577",
  marginBottom: "2rem",
  textAlign: "center"
})

const StyledText = styled('p')({
  fontFamily: "Roboto, sans-serif",
  fontWeight: 400,
  fontSize: "1rem",
  color: "#555555",
  textAlign: "center"
})

const Home = () => {
  return (
    <StyledContainer>
      <StyledTitle>About the App</StyledTitle>
      <StyledCard variant="outlined">
        <StyledSubTitle>Discover your next event with us</StyledSubTitle>
        <Typography variant="body1" align="center" gutterBottom>
          Our app uses the Ticketmaster API to help you find the latest events, attractions, and venues.
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          With just a few clicks, you can find all the information you need and book your tickets hassle-free.
        </Typography>
        <StyledSubTitle>Favorite concert memory</StyledSubTitle>
        <StyledCard variant="outlined">
          <StyledText>
            My favorite concert ever was during the Formula one in Bahrain when Avici performed. Being a big fan of his, I was super happy and pleasantly satisfied listening to him live and vibing with the crowd.
          </StyledText>
        </StyledCard>
      </StyledCard>
    </StyledContainer>
  );
};

export default Home;
