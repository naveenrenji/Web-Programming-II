import React from "react";
import "./App.css";
import { NavLink, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";
import LikedLocations from "./components/LikedLocations";
import UserPostedLocations from "./components/UserPostedLocations";
import NewLocation from "./components/NewLocation";
import Home from "./components/Home";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className="App-header">
            <h1 className="App-title">Location App</h1>
            <nav>
              <NavLink className="showlink" to="/">
                Home
              </NavLink>
              <NavLink className="showlink" to="/my-likes">
                My Likes
              </NavLink>
              <NavLink className="showlink" to="/my-locations">
                My Locations
              </NavLink>
            </nav>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-likes" element={<LikedLocations  />} />
            <Route path="/my-locations" element={<UserPostedLocations />} />
            <Route path="/new-location" element={<NewLocation />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
