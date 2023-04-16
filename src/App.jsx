import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './features/auth/Login'
import Register from './features/users/Register'
import Home from './features/auth/Home'
import MainLayout from './components/MainLayout'
import Layout from './components/Layout'
import FlashcardsList from './features/flashcards/FlashcardsList'
import EditFlashcard from './features/flashcards/EditFlashcard'
import NewFlashcardForm from './features/flashcards/NewFlashcardForm'
import ReviewFlashcards from './features/flashcards/ReviewFlashcards'
import GenerateFlashcards from './features/flashcards/GenerateFlashcards'
import Topic from './features/topics/Topic'
import TopicsList from './features/topics/TopicsList'
import UserProfile from './features/users/UserProfile'

import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Login />} />
        <Route path='register' element={<Register />} />

        {/* Beginning of PersistLogin */}
        <Route element={<PersistLogin />}>
          {/* Beginning of RequireAuth */}
          <Route element={<RequireAuth />}>

            {/* Beginning of Prefetch */}
            <Route element={<Prefetch />}>
              
              {/* Beginning of /home */}
              <Route path='home' element={<MainLayout />}>
                <Route index element={<Home />} />

                <Route path='flashcards'>
                      <Route index element={<FlashcardsList />} />
                      <Route path=':id' element={<EditFlashcard />} />
                      <Route path='new' element={<NewFlashcardForm />} />
                      <Route path='review' element={<ReviewFlashcards />} />
                      <Route path='generate' element={<GenerateFlashcards />} />
                </Route> 

                <Route path='topics'>
                  <Route index element={<TopicsList />} />
                  <Route path=':id' element={<Topic />} />
                </Route>

                <Route path='user'>
                  <Route path=':id' element={<UserProfile />}/>
                </Route>
              
              </Route>
              {/* End of /home */}

            </Route> 
            {/* End of Prefetch */}

          </Route>
          {/* End of RequireAuth */}

        </Route>
        {/* End of PersistLogin */}

      </Route>
    </Routes>
  )
}

export default App
