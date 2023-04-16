import React from "react";
import "./Users.css";

import { useGetUsersQuery } from "./usersApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import EditUserForm from "./EditUserForm";

import { PacmanLoader } from "react-spinners";

const UserProfile = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const { id } = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  if (!user)
    return (
      <div className="loading">
        <PacmanLoader color="#fad85d" />
      </div>
    );

  const content = <EditUserForm user={user} />;

  return (
    <div className="profile-section">
      <div className="home-link">
        <p className="go-back" onClick={handleGoBack}>
          ← Go Back
        </p>
      </div>
      <div className="profile-form">
        <div>{content}</div>
      </div>
    </div>
  );
};

export default UserProfile;
