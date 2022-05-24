import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/Validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import styles from "./PlaceForm.module.css";

const UpdatePlace = (props) => {
  const authCtx = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [identifiedPlace, setIdentifiedPlace] = useState();

  const navigate = useNavigate();

  const params = useParams();
  const placeId = params.placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/places/" + placeId
        );
        setIdentifiedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  if (!identifiedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>No place found!</h2>
        </Card>
      </div>
    );
  }

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places/" + placeId,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
      navigate(`/${authCtx.userId}/places`);
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && identifiedPlace && (
        <form
          className={styles["place-form"]}
          onSubmit={placeUpdateSubmitHandler}
        >
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title (non - empty)."
            onInput={inputHandler}
            initialValue={identifiedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (minimum 5 characters)."
            onInput={inputHandler}
            initialValue={identifiedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </Fragment>
  );
};

export default UpdatePlace;
