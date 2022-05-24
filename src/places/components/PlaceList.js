import React, { useContext } from "react";

import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";

import { AuthContext } from "../../shared/context/auth-context";

import styles from "./PlaceList.module.css";

const PlaceList = (props) => {
  const authCtx = useContext(AuthContext);

  if (props.items.length === 0) {
    return (
      <div className="center">
        {props.userId === authCtx.userId && (
          <Card>
            <h2>No places found.Maybe create one?</h2>
            <Button to="/places/new">Share Place</Button>
          </Card>
        )}
        {props.userId !== authCtx.userId && (
          <Card>
            <h2>No places found.</h2>
          </Card>
        )}
      </div>
    );
  }

  return (
    <ul className={styles["place-list"]}>
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
