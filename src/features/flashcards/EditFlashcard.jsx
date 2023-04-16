import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGetFlashcardsQuery } from "./flashcardsApiSlice";

import { PacmanLoader } from "react-spinners";

import EditFlashcardForm from "./EditFlashcardForm";

const EditFlashcard = () => {
  const { id } = useParams();
  const { flashcard } = useGetFlashcardsQuery("flashcardsList", {
    selectFromResult: ({ data }) => ({
      flashcard: data?.entities[id],
    }),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!flashcard)
    return (
      <div className="loading">
        <PacmanLoader color="#fad85d" />
      </div>
    );

  const content = <EditFlashcardForm flashcard={flashcard} />;

  return (
    <div className="new-flashcard">
      <div>
        <p className="go-back" onClick={handleGoBack}>
          ← Go Back
        </p>
      </div>
      {content}
    </div>
  );
};

export default EditFlashcard;
