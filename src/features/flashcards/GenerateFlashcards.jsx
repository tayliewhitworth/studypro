import React, { useState, useEffect } from "react";
import "./Flashcards.css";

import Generated from "./Generated";

import { useNavigate } from "react-router-dom";
import { useGenerateFlashcardMutation } from "./flashcardsApiSlice";

import { PacmanLoader } from 'react-spinners'

const GenerateFlashcards = () => {

    const [generateFlashcard, { isLoading, isSuccess, isError, error }] = useGenerateFlashcardMutation()

    const [topic, setTopic] = useState('')
    const [aiFlashcards, setAiFlashcards] = useState([])

    const navigate = useNavigate();


  const handleGoBack = () => {
    navigate(-1);
  };

  const onTopicChange = (e) => setTopic(e.target.value)

  const errContent = (error?.data?.message) ?? ''

  let content = (
    <div className="instructions">
      <div className="instruction-container">
        <h2>How this works:</h2>
        <p className="instruction-p">A.I. is here to help make your life easier!</p>
        <div>
          <ol className="ordered-list">
            <li>Enter in a topic of your choice (i.e. Math, Intro to Python, History) <br/><span>The more detailed the better!</span></li>
            <li>Press generate and wait for the magic to happen</li>
            <li>Once all the flashcards appear, save the ones you want to your flashcards collection!</li>
          </ol>
        </div>
        <p className="instruction-p">Try it for yourself!</p>
      </div>
    </div>
  )

  if (isError) {
    content = <p className="errmsg">{errContent}</p>
  }

  if (isLoading) {
    // content = <p className="loading">Loading...</p>
    content = <div className="loading"><PacmanLoader color="#fad85d"/></div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!topic) {
        content = <p className="no-topic">Please Enter a topic!</p>
    }
    try {
        const response = await generateFlashcard({ topic })
        const flashcards = response.data.flashcards
        setAiFlashcards(flashcards)
    } catch (error) {
        console.log('Error generating flashcards', error)
    }
  }

  if (isSuccess) {
    content = (
        <div className="all-aiFlashcards">
            {aiFlashcards.map((flashcard, index) => (
                <Generated key={index} topic={topic} question={flashcard.question} answer={flashcard.answer} />
            ))}
        </div>
    )
  }

  return (
    <div className="generate-section">
      <div className="home-link">
        <p className="go-back" onClick={handleGoBack}>
          ← Go Back
        </p>
      </div>
      <div>
        <div className="topicName">
          <h2>A.I. Generated Flashcards</h2>
          <div className="generate">
            <form onSubmit={handleSubmit}>
              <input
                className="generate-input"
                placeholder="Enter Topic"
                type="text"
                value={topic}
                id="topic"
                name="topic"
                onChange={onTopicChange}
              />
              <button type="submit" className="generate-btn">
                Generate
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="results">{content}</div>
    </div>
  );
};

export default GenerateFlashcards;
