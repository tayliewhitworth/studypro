import { useNavigate } from "react-router-dom";

import { useParams, Link } from "react-router-dom";
import { useGetTopicsQuery } from "./topicsApiSlice";
import Flashcard from '../flashcards/Flashcard'

import { useEffect } from "react";

const Topic = () => {
  const { id } = useParams();
  const { topic } = useGetTopicsQuery("topicsList", {
    selectFromResult: ({ data }) => ({
      topic: data?.entities[id],
    }),
  });

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="individual-topic">
      <div className="home-link">
        <p className="go-back" onClick={handleGoBack}>
          ← Go Back
        </p>
      </div>
      <div className="topicName">
        <h2>
          {topic.topicName}
        </h2>
      </div>
      <div className="topic-flashcards">
        {topic.flashcards.length !== 0 ? (
          <div>
            {topic.flashcards.map((card) => (
              <div className="flashcards-grid">
                <Flashcard key={card._id} flashcardId={card._id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-flashcards">
            <h2>No Flashcards for this topic yet!</h2>
            <p>Want to add one?</p>
            <Link to='/home/flashcards/new'>
              Click Here!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topic;
