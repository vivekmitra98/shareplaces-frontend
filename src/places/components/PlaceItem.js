import React, { Fragment, useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import styles from "./PlaceItem.module.css";

const PlaceItem = (props) => {
  const authCtx = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showMap, setShowMap] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const openDeleteWarningHandler = () => {
    setShowConfirmDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmDeleteModal(false);
  };

  const confrimDeleteHandler = async () => {
    setShowConfirmDeleteModal(false);

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places/" + props.id,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass={styles["place-item__modal-content"]}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
        footerClass={styles["place-item__modal-actions"]}
      >
        <div className={styles["map-container"]}>
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmDeleteModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass={styles["place-item__modal-actions"]}
        footer={
          <Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confrimDeleteHandler}>
              DELETE
            </Button>
          </Fragment>
        }
      >
        This place will be permanently deleted! This cannot be undone!
      </Modal>
      <li className={styles["place-item"]}>
        <Card className={styles["place-item__content"]}>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className={styles["place-item__image"]}>
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className={styles["place-item__info"]}>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className={styles["place-item__actions"]}>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {authCtx.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {authCtx.userId === props.creatorId && (
              <Button danger onClick={openDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlaceItem;
