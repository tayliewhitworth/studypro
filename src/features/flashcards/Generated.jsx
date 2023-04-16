import React, { useState } from "react";
import "./Flashcards.css";

import { FaSave } from "react-icons/fa";

import { useAddNewFlashcardMutation } from "./flashcardsApiSlice";
import useAuth from "../../hooks/useAuth";

const Generated = ({ topic, question, answer }) => {
  const { username } = useAuth()

  const [flip, setFlip] = useState(false);
  const [addNewFlashcard, { isLoading, isSuccess, isError, error }] =
    useAddNewFlashcardMutation();

  const onSaveFlashcardClicked = async (e) => {
    e.preventDefault();
    await addNewFlashcard({ topic, question, answer, createdBy: username });
  };

  let content = (
    <div
      className={`card ${flip ? "flip" : ""}`}
      onClick={() => setFlip(!flip)}
    >
      <div className="front">
        <p className="card-title">Question:</p>
        {question}
      </div>
      <div className="back">
        <p className="card-title">Answer:</p>
        {answer}
      </div>
      {!flip && (
        <button className="save-card" onClick={onSaveFlashcardClicked}>
          Save Flashcard <FaSave />
        </button>
      )}
    </div>
  )

  if (isError) {
    content = <p>{error?.data?.message}</p>;
  }

  if (isLoading) {
    content = (
      <div className="card">
        <div className="front">
          <p className="card-title">Saving card!</p>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    content = (
      <div className="card">
        <div className="front">
          <p className="card-title">Flashcard Saved!</p>
        </div>
      </div>
    );
  }

  return content;
};

export default Generated;
