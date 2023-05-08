import React, { useState, useEffect } from "react";
import {
  useGetFlashcardsQuery,
  useUpdateFlashcardMutation,
} from "./flashcardsApiSlice";

import "./Flashcards.css";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { PacmanLoader } from "react-spinners";

const ReviewFlashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [wrongTopic, setWrongTopic] = useState([]);
  const [gotRight, setGotRight] = useState(0);
  const [gotWrong, setGotWrong] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const { username } = useAuth();

  const {
    data: flashcards,
    isError,
    error,
    isLoading,
    isSuccess,
  } = useGetFlashcardsQuery(null, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [
    updateFlashcard,
    {
      isLoading: updateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateFlashcardMutation();

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  let content;
  let searchContent;

  if (isLoading || updateLoading)
    content = (
      <div className="loading">
        <PacmanLoader color="#fad85d" />
      </div>
    );

  const errContent = (error?.data?.message || updateError?.data?.message) ?? "";

  if (isError || isUpdateError) content = <p>{errContent}</p>;

  if (isSuccess || isUpdateSuccess) {
    const { entities } = flashcards;
    let mappedCards = Object.values(entities).sort(
      (a, b) => a.interval - b.interval
    );
    let reviewCard = mappedCards.filter((id) => id.username === username);

    if (reviewCard.length === 0) {
      return (
        <div className="review-section">
          <div className="home-link">
            <p className="go-back" onClick={handleGoBack}>
              ← Go Back
            </p>
          </div>
          <div className="topicName">
            <h2>Review Session</h2>
          </div>
          <div className="topic-flashcards">
            <div className="no-more-cards">
              <p>No cards to review!</p>
              <div className="total-reviewed">
                <p>
                  <Link to="/home/flashcards/new">
                    Click here to make a flashcard!
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    searchContent = (
      <div className="sort-section">
        <label className="sort-label" htmlFor="searchTerm">
          Review By Topic:
        </label>
        <select
          id="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <option value="">All Topics</option>
          {Array.from(new Set(reviewCard.map((card) => card.topicName))).map(
            (topicName) => (
              <option key={topicName} value={topicName}>
                {topicName}
              </option>
            )
          )}
        </select>
      </div>
    );

    const filteredCardContent = reviewCard.filter(
      (card) => searchTerm === "" || card.topicName === searchTerm
    );

    const handleEasyClick = async () => {
      const interval = filteredCardContent[currentIndex].interval;
      const newReviewDate = new Date();
      newReviewDate.setDate(newReviewDate.getDate() + 1);

      await updateFlashcard({
        id: filteredCardContent[currentIndex].id,
        topic: filteredCardContent[currentIndex].topicName,
        question: filteredCardContent[currentIndex].question,
        answer: filteredCardContent[currentIndex].answer,
        reviewDate: newReviewDate,
        interval: interval * 2,
      });
      setIsAnimating(true);
      setCurrentIndex(currentIndex + 1);
      setGotRight(gotRight + 1);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    };

    const handleHardClick = async () => {
      const interval = filteredCardContent[currentIndex].interval;
      const newReviewDate = new Date();
      newReviewDate.setMinutes(newReviewDate.getMinutes() + 10);

      await updateFlashcard({
        id: filteredCardContent[currentIndex].id,
        topic: filteredCardContent[currentIndex].topicName,
        question: filteredCardContent[currentIndex].question,
        answer: filteredCardContent[currentIndex].answer,
        reviewDate: newReviewDate,
        interval: interval * 0.5,
      });
      setIsAnimating(true);
      setCurrentIndex(currentIndex + 1);
      setGotWrong(gotWrong + 1);
      setWrongTopic([
        ...wrongTopic,
        filteredCardContent[currentIndex].topicName,
      ]);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    };

    content = (
      <div>
        <div>
          {currentIndex + 1} / {filteredCardContent.length}
        </div>
        {currentIndex < filteredCardContent.length ? (
          <div className="review-card">
            <div
              className={`card ${flip ? "flip" : ""} ${
                isAnimating ? "scale-up-center" : ""
              }`}
              onClick={() => setFlip(!flip)}
            >
              <div className="front">
                <div className="flashcard-topic-container">
                  <p className="flashcard-topic">
                    Topic: {filteredCardContent[currentIndex].topicName}
                  </p>
                </div>
                <p className="card-title">Question:</p>
                {filteredCardContent[currentIndex].question}
              </div>
              <div className="back">
                <p className="card-title">Answer:</p>
                {filteredCardContent[currentIndex].answer}
              </div>
            </div>
            <div className="review-btns">
              <button onClick={handleEasyClick}>Got it Right</button>
              <button onClick={handleHardClick}>Got it Wrong</button>
            </div>
          </div>
        ) : (
          <div className="no-more-cards">
            <p>
              Great job!
              <br /> Come back later to test yourself again!
            </p>
            <div className="total-reviewed">
              <p>
                Right: {gotRight} <span>Wrong: {gotWrong} </span>
              </p>
              <p>Topics to work on:</p>
              {wrongTopic.length > 0 ? (
                <div className="mapped-wrong">
                  {wrongTopic.map((topic, index) => (
                    <p key={index}>{topic}</p>
                  ))}
                </div>
              ) : (
                <div className="mapped-wrong">None! Good job!</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="review-section">
      <div className="home-link">
        <p className="go-back" onClick={handleGoBack}>
          ← Go Back
        </p>
      </div>
      <div className="topicName">
        <h2>Review Session</h2>
      </div>
      <div className="topic-flashcards">
        <div className="sort-bar">{searchContent}</div>
        {content}
      </div>
    </div>
  );
};

export default ReviewFlashcards;
