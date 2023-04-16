import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";

import { FiLogOut } from "react-icons/fi";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useGetUsersQuery } from "../features/users/usersApiSlice";
import useAuth from "../hooks/useAuth";

import { PacmanLoader } from "react-spinners";

import "./Header.css";

const listItem = [
  {
    to: "/home",
    title: "Home",
  },
  {
    to: "/home/flashcards",
    title: "All Flashcards",
  },
  {
    to: "/home/flashcards/review",
    title: "Review Session",
  },
  {
    to: "/home/flashcards/new",
    title: "Create Flashcard",
  },
  {
    to: "/home/flashcards/generate",
    title: "Generate A.I. Flashcards",
  },
];

const Header = () => {
  const { username } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const {
    data: users,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError,
  } = useGetUsersQuery(null, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading || isUserLoading) return <PacmanLoader />;
  if (isError || isUserError)
    return <p>Error: {error?.data?.message || userError?.data?.message}</p>;

  const logoutBtn = (
    <button
      className="logout-btn"
      type="button"
      title="Logout"
      onClick={sendLogout}
    >
      Logout <FiLogOut />
    </button>
  );

  let userBtn;

  if (isUserSuccess) {
    const { ids, entities } = users;
    const searchId = ids.find((id) => entities[id].username === username);
    const userId = entities[searchId]._id;

    userBtn = (
      <button title="Profile" onClick={() => navigate(`/home/user/${userId}`)}>
        <RxAvatar />
      </button>
    );
  }

  return (
    <div className="navbar">
      <div className="header-section">
        <Link to="/home" title="Home">
          <h2>Study Pro</h2>
        </Link>
      </div>
      <div className="menu-section">
        <div>
          {userBtn}
        </div>
        <div className="nav-items-parent">
          <button
            title="menu"
            className="menuBtn"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
          <ul className={showMenu ? "nav-items show" : "nav-items"}>
            {listItem.map((item, i) => (
              <li key={i} onClick={() => setShowMenu(!showMenu)}>
                <Link to={item.to}>{item.title}</Link>
              </li>
            ))}
            <li className="logout-btn-item">{logoutBtn}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
