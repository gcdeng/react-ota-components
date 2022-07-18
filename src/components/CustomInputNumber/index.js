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
const ACTIONS = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
};

const CustomInputNumber = (props) => {
  const {
    name = "",
    min = 0,
    max,
    step = 1,
    value: defaultValue = 0,
    disabled = false,
    onChange = () => {},
    onBlur = () => {},
  } = props;

  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isDecButtonDisabled, setIsDecButtonDisabled] = useState(
    disabled || defaultValue <= min
  );
  const [isIncButtonDisabled, setIsIncButtonDisabled] = useState(
    disabled || defaultValue >= max
  );

  useEffect(() => {
    onChange({ target: inputRef.current });
  }, [inputValue]);

  useEffect(() => {
    // control button disable state
    setIsIncButtonDisabled(
      disabled || inputValue === max || inputValue + step > max
    );
    setIsDecButtonDisabled(
      disabled || inputValue === min || inputValue - step < min
    );
  }, [disabled, inputValue, max, min, step]);

  useEffect(() => {
    // in case the button not emit mouseup event when it become disable state, so we need to stop long press manually
    if (isDecButtonDisabled || isIncButtonDisabled) {
      stopLongPressButton();
    }
  }, [isDecButtonDisabled, isIncButtonDisabled]);

  const onInputChange = (event) => {
    const nevValue = parseInt(event.target.value);
    !isNaN(nevValue) &&
      nevValue <= max &&
      nevValue >= min &&
      setInputValue(nevValue);
  };

  const onInputBlur = (event) => {
    // handle if value exceed limit by typing directly
    if (inputValue > max) {
      setInputValue(max);
    }
    if (inputValue < min) {
      setInputValue(min);
    }
    onBlur(event);
  };

  const updateInputValue = ({ type }) => {
    switch (type) {
      case ACTIONS.INCREMENT: {
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
      case ACTIONS.DECREMENT: {
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
    updateInputValue({ type });
    clearInterval(_longPressTimeoutId);
    _longPressTimeoutId = setInterval(() => {
      longPressButton({ type });
    }, 500);
  };

  const stopLongPressButton = () => {
    clearInterval(_longPressTimeoutId);
  };

  return (
    <Container>
      <Button
        disabled={isDecButtonDisabled}
        onMouseDown={() => longPressButton({ type: ACTIONS.DECREMENT })}
        onMouseUp={stopLongPressButton}
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
        disabled={disabled || inputValue >= max}
        onBlur={onInputBlur}
        onChange={onInputChange}
        ref={inputRef}
      />
      <Button
        disabled={isIncButtonDisabled}
        onMouseDown={() => longPressButton({ type: ACTIONS.INCREMENT })}
        onMouseUp={stopLongPressButton}
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
