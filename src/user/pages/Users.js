import React, { Fragment, useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };

    fetchUsers();
  }, [sendRequest]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers.length === 0 && (
        <div className="center card">
          <Card>
            <h2>
              An app where ussers can see photos and descriptions of places
              shared by other users and also share there own places for others!
            </h2>
          </Card>
        </div>
      )}
      {!isLoading && loadedUsers.length > 0 && (
        <UsersList items={loadedUsers} />
      )}
    </Fragment>
  );
};

export default Users;
