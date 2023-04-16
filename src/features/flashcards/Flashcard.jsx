import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useGetFlashcardsQuery } from "./flashcardsApiSlice";
import { memo } from "react";

import "./Flashcards.css";

const Flashcard = ({ flashcardId }) => {
  const [flip, setFlip] = useState(false);

  const { flashcard } = useGetFlashcardsQuery("flashcardsList", {
    selectFromResult: ({ data }) => ({
      flashcard: data?.entities[flashcardId],
    }),
  });

  const navigate = useNavigate();

  if (flashcard) {
    const handleEdit = () => navigate(`/home/flashcards/${flashcardId}`);

    return (
        <div
          className={`card ${flip ? "flip" : ""}`}
          onClick={() => setFlip(!flip)}
        >
          <div className="front">
            <div className="flashcard-topic-container">
              <p className="flashcard-topic">Topic: {flashcard.topicName}</p>
            </div>
            <p className="card-title">Question:</p>
            {flashcard.question}
          </div>
          <div className="back">
            <p className="card-title">Answer:</p>
            {flashcard.answer}
          </div>
          {!flip && (
            <>
              <button title="Edit" className="card-edit" onClick={handleEdit}>
                <FaRegEdit />
              </button>
            </>
          )}
        </div>
    );
  } else return null;
};

const memoizedFlashcard = memo(Flashcard);
export default memoizedFlashcard;
