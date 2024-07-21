import React from "react";
import Header from "./Header";
import HeroSection from "./hero";

const Home = () => {
  return (
    <>
      <div>
        <Header />
        <h1 style={{ textAlign: "center", fontSize: "3rem", color: "white" }}>
          <u>Train Seat Booking System</u>
        </h1>
        <h6 style={{ textAlign: "center", fontSize: "1.2rem", color: "white" }}>
          Mainly focus (backend):{" "}
          <span style={{ color: "yellow", fontWeight: "bold" }}>
            Automatic Seat Allocation
          </span>
        </h6>
        <HeroSection />
      </div>
    </>
  );
};

export default Home;
