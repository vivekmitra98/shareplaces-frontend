import React, { useEffect, useReducer } from "react";

import { validate } from "../../util/Validators";

import styles from "./Input.module.css";

const inputReducer = (state, action) => {
  if (action.type === "CHANGE") {
    return {
      ...state,
      value: action.val,
      isValid: validate(action.val, action.validators),
    };
  }

  if (action.type === "TOUCH") {
    return {
      ...state,
      isTouched: true,
    };
  }

  return state;
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { isValid, value } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const inputChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const inputTouchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={inputChangeHandler}
        onBlur={inputTouchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 4}
        onChange={inputChangeHandler}
        onBlur={inputTouchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`${styles["form-control"]} ${
        !inputState.isValid &&
        inputState.isTouched &&
        styles["form-control--invalid"]
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
