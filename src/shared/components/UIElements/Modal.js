import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";

import styles from "./Modal.module.css";

const ModalOverlay = (props) => {
  const content = (
    <div className={`${styles.modal} ${props.className}`} style={props.style}>
      <header className={`${styles["modal__header"]} ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit
            ? props.onSubmit
            : (event) => {
                event.preventDefault();
              }
        }
      >
        <div className={`${styles["modal__content"]} ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`${styles["modal__footer"]} ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        timeout={400}
        classNames={{
          enterActive: styles["modal-enter-active"],
          enter: styles["modal-enter"],
          exitActive: styles["modal-exit-active"],
          exit: styles["modal-exit"],
        }}
        mountOnEnter
        unmountOnExit
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </Fragment>
  );
};

export default Modal;
