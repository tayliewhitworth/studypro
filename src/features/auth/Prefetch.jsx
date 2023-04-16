import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { flashcardsApiSlice } from "../flashcards/flashcardsApiSlice";
import { topicsApiSlice } from "../topics/topicsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";


const Prefetch = () => {

    useEffect(() => {
        store.dispatch(flashcardsApiSlice.util.prefetch('getFlashcards', 'flashcardsList', { force: true }))
        store.dispatch(topicsApiSlice.util.prefetch('getTopics', 'topicsList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    }, []);

  return <Outlet />
}

export default Prefetch