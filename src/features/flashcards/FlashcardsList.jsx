import React, { useState, useEffect } from "react";
import "./Flashcards.css";

import { useGetFlashcardsQuery } from "./flashcardsApiSlice";
import Flashcard from "./Flashcard";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { PacmanLoader } from "react-spinners";

const FlashcardsList = () => {
  const { username } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: flashcards,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetFlashcardsQuery("flashcardsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let content;
  let searchContent;

  if (isLoading)
    content = (
      <div className="loading">
        <PacmanLoader color="#fad85d" />
      </div>
    );

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { entities } = flashcards;
    let allCards = Object.values(entities).sort((a, b) =>
      a.topicName.localeCompare(b.topicName)
    );
    const mappedFlashcards = allCards.filter(
      (flashcardId) => flashcardId.username === username
    );

    if (mappedFlashcards?.length === 0) {
      return (
        <div className="flashcards-section">
          <div className="home-link">
            <Link to="/home">← Go Back Home</Link>
          </div>
          <div className="title-section search-section">
            <h2 className="topics-title">All Flashcards</h2>
          </div>
          <div className="all-flashcards">
            <div className="flashcards-grid">
              <div className="card">
                <div className="front">
                  <p>No Flashcards!</p>
                  <p>
                    Click{" "}
                    <span className="make-flashcard-link">
                      <Link to="/home/flashcards/new">Here</Link>
                    </span>{" "}
                    to make one!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    searchContent = (
      <div className="sort-section">
        <label htmlFor="searchTerm" className="sort-label">
          Sort By:
        </label>
        <select
          id="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <option value="">All Topics</option>
          {Array.from(
            new Set(mappedFlashcards.map((flashcard) => flashcard.topicName))
          ).map((topicName) => (
            <option key={topicName} value={topicName}>
              {topicName}
            </option>
          ))}
        </select>
      </div>
    );

    const filteredCardContent = mappedFlashcards.filter(
      (flashcard) => searchTerm === "" || flashcard.topicName === searchTerm
    );

    const cardContent = filteredCardContent.map((flashcardId) => (
      <Flashcard key={flashcardId.id} flashcardId={flashcardId.id} />
    ));

    content = <div className="flashcards-grid">{cardContent}</div>;
  }

  return (
    <div className="flashcards-section">
      <div className="home-link">
        <Link to="/home">← Go Back Home</Link>
      </div>
      <div className="title-section search-section">
        <h2 className="topics-title">
          {searchTerm === "" ? "All Flashcards" : `${searchTerm}`}
        </h2>
      </div>
      <div className="all-flashcards">
        {searchContent}
        {content}
      </div>
    </div>
  );
};

export default FlashcardsList;
