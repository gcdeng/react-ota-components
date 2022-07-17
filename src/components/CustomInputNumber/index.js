import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Button = styled.button`
  width: 48px;
  height: 48px;
  border: 1px solid rgb(30, 159, 210);
  background-color: white;
  color: rgb(30, 159, 210);
  font-size: 16px;
  border-radius: 4px;
  opacity: ${(props) => (props.disabled ? 0.48 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: rgb(240, 253, 255);
  }
`;

const Input = styled.input`
  width: 48px;
  height: 48px;
  color: rgb(89, 89, 89);
  border: 1px solid rgb(191, 191, 191);
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  text-align: center;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] {
    -moz-appearance: textfield;
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

const Container = styled.div`
  & > * + * {
    margin-left: 8px;
  }
`;

let _longPressTimeoutId;

const CustomInputNumber = (props) => {
  const {
    name = "",
    min = 0,
    max,
    step = 1,
    value = 0,
    disabled = false,
    onChange = () => {},
    onBlur = () => {},
  } = props;

  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(value);
  const [isDecButtonDisabled, setIsDecButtonDisabled] = useState(
    disabled || value <= min
  );
  const [isIncButtonDisabled, setIsIncButtonDisabled] = useState(
    disabled || value >= max
  );

  const onInputChange = (event) => {
    const nevValue = parseInt(event.target.value);
    console.log(nevValue);
    if (nevValue <= max && nevValue >= min) {
      setInputValue(nevValue);
    }
  };

  const onClickButton = ({ type }) => {
    switch (type) {
      case "inc": {
        setInputValue((prevValue) => {
          const nextValue = prevValue + step;
          if (nextValue <= max) {
            return nextValue;
          } else {
            return prevValue;
          }
        });
        break;
      }
      case "dec": {
        setInputValue((prevValue) => {
          const nextValue = prevValue - step;
          if (nextValue >= min) {
            return nextValue;
          } else {
            return prevValue;
          }
        });
        break;
      }
      default:
        break;
    }
  };

  const longPressButton = ({ type }) => {
    onClickButton({ type });
    _longPressTimeoutId && clearInterval(_longPressTimeoutId);
    _longPressTimeoutId = setInterval(() => {
      longPressButton({ type });
    }, 500);
  };

  const cancelLongPressButton = () => {
    clearInterval(_longPressTimeoutId);
  };

  useEffect(() => {
    setIsIncButtonDisabled(inputValue >= max);
    setIsDecButtonDisabled(inputValue <= min);
    if (inputValue >= max || inputValue <= min) {
      cancelLongPressButton();
    }
    onChange({ target: inputRef.current });
  }, [inputValue]);

  useEffect(() => {
    setIsIncButtonDisabled(disabled || value >= max);
    setIsDecButtonDisabled(disabled || value <= min);
  }, [disabled]);

  return (
    <Container>
      <Button
        disabled={isDecButtonDisabled}
        onMouseDown={() => longPressButton({ type: "dec" })}
        onMouseUp={cancelLongPressButton}
      >
        -
      </Button>
      <Input
        inputMode="numeric"
        type="number"
        name={name}
        min={min}
        max={max}
        value={inputValue}
        disabled={disabled}
        onBlur={onBlur}
        onChange={onInputChange}
        ref={inputRef}
      />
      <Button
        disabled={isIncButtonDisabled}
        onMouseDown={() => longPressButton({ type: "inc" })}
        onMouseUp={cancelLongPressButton}
      >
        +
      </Button>
    </Container>
  );
};

CustomInputNumber.propTypes = {
  name: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default CustomInputNumber;
