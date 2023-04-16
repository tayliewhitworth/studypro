import React from 'react'
import './Topic.css'

import { useGetTopicsQuery } from './topicsApiSlice'
import { Link, useNavigate } from 'react-router-dom'

import flashcard from '../../assets/flash-cards.png'

const FavTopics = () => {
  const navigate = useNavigate()
  const {
    data: topics,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTopicsQuery()

  let content;

  if (isLoading) content = <p>Loading...</p>

  if (isError) content = <p>{error?.data?.message}</p>

  if (isSuccess) {
    const { entities } = topics
    let topicCard = Object.values(entities).slice(0, 3)
    
    content = (
      <div className='topic-container'>
        {Object.values(topicCard).map(topic => {
          const handleClick = () => navigate(`/home/topics/${topic.id}`)
          return (
            <div className='topic' key={topic.id}>
              <p className='topic-name' onClick={handleClick}>{topic.topicName}</p>
              <div className='img-container'>
                <img className='flashcard-img' src={flashcard} alt='icon' />
              </div>
              <div>
                <span>{topic.flashcards.length}</span>
                <p className='accent'>Flashcards</p>
              </div>
            </div>
          )
        })}
      </div>
    )

  }


  return (
    <div className='all-topics'>
      <div className='title-section flex-col'>
        <h2>A.I. <span>Generated</span> Flashcards!</h2>
        <p className='link-topics'>View your flashcards <span><Link to='/home/flashcards'>here!</Link></span></p>
      </div>
      {content}
    </div>
  )
}

export default FavTopics