import React from "react";
import { Container, Row, Col } from "reactstrap";
import heroImg from "./train.png";
import "./hero.css";
import GraphemeSplitter from "grapheme-splitter";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const splitter = new GraphemeSplitter();
  return (
    <section>
      <Container className="cont">
        <div className="hero__content">
          <h1
            className=" hero__title"
            style={{ fontSize: "40px", marginTop: "50px", color: "whitesmoke" }}
          >
            Travel Smart, Travel by Train <br />
          </h1>

          <h2 style={{ marginTop: "40px" }}>
            <TypeAnimation
              splitter={(str) => splitter.splitGraphemes(str)}
              sequence={[
                "Book Your Journey",
                2000,
                "Seamless Train Booking",
                2000,
              ]}
              style={{ fontSize: "4rem", color: "orange" }}
              repeat={Infinity}
            />
          </h2>
          <h3 style={{ marginTop: "40px", color: "whitesmoke" }}>
            "All Aboard! Secure Your Seats Now..."
          </h3>
          <div style={{ marginTop: "5rem" }}>
            <Link
              className=" rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-4 md:px-5 py-4 md:py-5 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold w-1/2 my-10"
              role="button"
              to="/signup"
            >
              <span>Get Started!</span>
            </Link>
          </div>
        </div>
        <div>
          {" "}
          <img src={heroImg} alt="" className=" hero__img" width={500} />
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
