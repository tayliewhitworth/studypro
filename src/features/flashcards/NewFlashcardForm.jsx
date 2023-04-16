import { useState, useEffect } from "react";
import { useAddNewFlashcardMutation } from "./flashcardsApiSlice";
import { useNavigate } from "react-router-dom";

import useAuth from '../../hooks/useAuth'

import { FaSave } from "react-icons/fa";

const NewFlashcardForm = () => {
  const { username } = useAuth()

  const [addNewFlashcard, { isLoading, isSuccess, isError, error }] =
    useAddNewFlashcardMutation();

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1)
  }

  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setTopic("");
      setQuestion("");
      setAnswer("");
      navigate("/home/flashcards");
    }
  }, [isSuccess, navigate]);

  const onTopicChange = (e) => setTopic(e.target.value);
  const onQuestionChange = (e) => setQuestion(e.target.value);
  const onAnswerChange = (e) => setAnswer(e.target.value);

  const canSave = [topic, question, answer].every(Boolean) && !isLoading;

  const onSaveFlashcardClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewFlashcard({ topic, question, answer, createdBy: username });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validTopicClass = !topic ? "form_input--incomplete" : "";
  const validQuestionClass = !question ? "form_input--incomplete" : "";
  const validAnswerClass = !answer ? "form_input--incomplete" : "";

  const content = (
    <div className="new-flashcard">
      <p className={errClass}>{error?.data?.message}</p>
      <div className="home-link">
        <p className="go-back" onClick={handleGoBack}>
        ← Go Back
        </p>
      </div>

      <form className="flashcard-form" onSubmit={onSaveFlashcardClicked}>
        <div className="form-title">
          <h2>New Flashcard</h2>
          <div className="form-action-btns">
            <button className="form-btn" title="Save" disabled={!canSave}>
              <FaSave />
            </button>
          </div>
        </div>

        <div className="input-container">

          <div className="flashcard-input">
            <label className="form_label" htmlFor="topic">
              Topic
            </label>
            <input
              className={`form-input ${validTopicClass}`}
              id="topic"
              name="topic"
              type="text"
              value={topic}
              onChange={onTopicChange}
              placeholder='Discrete Math'
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
              value={question}
              onChange={onQuestionChange}
              placeholder="What is the sum rule?"
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
              placeholder='Answer goes here!'
            />
          </div>
        </div>
      </form>
    </div>
  );

  return content
};

export default NewFlashcardForm;
