import React, { useState, useEffect} from "react";
import {
  useUpdateFlashcardMutation,
  useDeleteFlashcardMutation,
} from "./flashcardsApiSlice";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTrash } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";

const EditFlashcardForm = ({ flashcard }) => {
  const { username } = useAuth()

  const [updateFlashcard, { isLoading, isSuccess, isError, error }] =
    useUpdateFlashcardMutation();

  const [
    deleteFlashcard,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteFlashcardMutation();

  const navigate = useNavigate();

  const [topic, setTopic] = useState(flashcard.topicName);
  const [question, setQuestion] = useState(flashcard.question);
  const [answer, setAnswer] = useState(flashcard.answer);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTopic("");
      setQuestion("");
      setAnswer("");
      navigate("/home/flashcards");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTopicChange = (e) => setTopic(e.target.value);
  const onQuestionChange = (e) => setQuestion(e.target.value);
  const onAnswerChange = (e) => setAnswer(e.target.value);

  const canSave = [topic, question, answer].every(Boolean) && !isLoading;

  const onSaveFlashcardClicked = async (e) => {
    if (canSave) {
      await updateFlashcard({
        id: flashcard.id,
        topic,
        question,
        answer,
        createdBy: username,
        reviewDate: flashcard.reviewDate,
        interval: flashcard.interval,
      });
    }
  };

  const onDeleteFlashcardClicked = async (e) => {
    await deleteFlashcard({ id: flashcard.id });
  };

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTopicClass = !topic ? "form_input--incomplete" : "";
  const validQuestionClass = !question ? "form_input--incomplete" : "";
  const validAnswerClass = !answer ? "form_input--incomplete" : "";

  const errContent = (error?.data?.message || delError?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="flashcard-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-title">
          <h2>Edit Flashcard</h2>
          <div className="form-action-btns edit-btns">
            <button
              className="form-btn"
              title="Save"
              onClick={onSaveFlashcardClicked}
              disabled={!canSave}
            >
              <FaSave />
            </button>
            <button
              className="form-btn"
              title="Delete"
              onClick={onDeleteFlashcardClicked}
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="flashcard-input">
          <label className="form_label" htmlFor="topic">
            Topic
          </label>
          <input
            className={`form-input ${validTopicClass}`}
            id="topic"
            name="topic"
            type="text"
            autoComplete="off"
            value={topic}
            onChange={onTopicChange}
          />
        </div>

        <div className="flashcard-input">
          <label className="form_label" htmlFor="question">
            Question
          </label>
          <input
            className={`form-input ${validQuestionClass}`}
            id="question"
            name="question"
            type="text"
            autoComplete="off"
            value={question}
            onChange={onQuestionChange}
          />
        </div>

        <div className="flashcard-input">
          <label className="form_label" htmlFor="answer">
            Answer
          </label>
          <textarea
            className={`form-input input-text ${validAnswerClass}`}
            id="answer"
            name="answer"
            value={answer}
            onChange={onAnswerChange}
          />
        </div>
      </form>
    </>
  );

  return content;
};

export default EditFlashcardForm;
