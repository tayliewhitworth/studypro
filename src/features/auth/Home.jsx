import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FavTopics from "../topics/FavTopics";

import useAuth from "../../hooks/useAuth";

const Home = () => {
  const [show, setShow] = useState(false);

  const { username } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-section">
      <div className="hero">
        <h2>
          Hi <span className="username">{username}!</span>
          <br /> Ready to <span className="study">Study?</span>
        </h2>
        <div className="hero-btns">
          <Link to="/home/flashcards/review" className="hero-btn">
            Review Session
          </Link>
          <div className="hero-btn" onClick={() => setShow(!show)}>
            <div className="hero-parent">
              <p>
                Create Flashcards
                <span>{show ? " -" : " +"}</span>
              </p>
              <div
                className={show ? "hidden-elements show" : "hidden-elements"}
              >
                <Link to="/home/flashcards/new">Create your own</Link>
                <Link to="/home/flashcards/generate">
                  A.I. generated flashcards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fav-topics">
        <div className="topics">
          <FavTopics />
        </div>
      </div>
    </div>
  );
};

export default Home;
