import React, { useState, useEffect } from "react";
import "./Topic.css";

import { useGetTopicsQuery, useDeleteTopicMutation } from "./topicsApiSlice";
import { Link } from "react-router-dom";

import { BsSearch } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import flashcard from "../../assets/flash-cards.png";

import useAuth from "../../hooks/useAuth";

const colors = [
  "var(--yellow)",
  "var(--periwinkle)",
  "var(--violet)",
  "var(--turquoise)",
  "var(--yellow-shadow)",
  "var(--light-green)",
];

const TopicsList = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { username } = useAuth();

  const [searchTerm, setSearchTerm] = useState('')

  const [
    deleteFlashcard,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteTopicMutation();

  const {
    data: topics,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTopicsQuery('topicsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  const errContent = (error?.data?.message || delError?.data?.message) ?? "";

  if (isError || isDelError) content = <p>{errContent}</p>;

  const onSearchTermChange = (e) => setSearchTerm(e.target.value)

  if (isSuccess || isDelSuccess) {
    const { entities } = topics;
    let topicCard = Object.values(entities).sort((a, b) => a.topicName.localeCompare(b.topicName));


    const filteredData = topicCard.filter(item => {
      if (searchTerm.trim() === '') {
        return true
      } else {
        return item.topicName.toLowerCase().includes(searchTerm.toLowerCase())
      }
    })

    content = (
      <div className="all-topics-container">
        {filteredData.map((topic, index) => {
          const onDeleteTopicClicked = async () => {
            await deleteFlashcard({ id: topic.id });
          };

          return (
            <div
              className="topic"
              key={topic.id}
              style={{
                backgroundColor:
                  colors[index % colors.length]
              }}
            >
              <div className="delete-btn">
                <button className="trashcan" title="delete" onClick={onDeleteTopicClicked}>
                  <FaTrash />
                </button>
              </div>
              <div className="name-section">
                <img className="flash-icon" src={flashcard} alt="icon" />
                <Link className="topic-name" to={`/home/topics/${topic.id}`}>
                  {topic.topicName}
                </Link>
              </div>
              <div>
                <span>{topic.flashcards.length}</span>
                <p>Flashcards</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="topics-list">
      <div className="home-link">
        <Link to="/home">← Go Back Home</Link>
      </div>
      <div className="title-section search-section">
        <h2 className="topics-title">All Topics</h2>
        <div className="search">
          <input 
            placeholder="Search" 
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={searchTerm}
            onChange={onSearchTermChange}
          />
          <button className="search-btn" title="Search">
            <BsSearch />
          </button>
        </div>
      </div>
      <div className="fav-topics">{content}</div>
    </div>
  );
};

export default TopicsList;
