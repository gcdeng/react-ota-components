import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomInputNumber from "../CustomInputNumber";
import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    margin: 10px 0;
  }
`;

const SmallCaption = styled.p`
  font-size: 12px;
  color: gray;
`;

const Room = (props) => {
  const {
    maxGuestNum,
    minAdultNum = 1,
    minChildNum = 0,
    initAdultNum,
    initChildNum,
    customInputNumberStep = 1,
    disabled = false,
    onChange,
  } = props;

  const [allocation, setAllocation] = useState({
    adult: initAdultNum,
    child: initChildNum,
  });

  const [guestNum, setGuestNum] = useState(initAdultNum + initChildNum);

  useEffect(() => {
    onChange(allocation);
    setGuestNum(allocation.adult + allocation.child);
  }, [allocation]);

  const onInputChange = (event) => {
    setAllocation((prevAllocation) => ({
      ...prevAllocation,
      [event.target.name]: parseInt(event.target.value),
    }));
  };

  const onInputBlur = (event) => {
    console.log(event.target.name, event.target.value);
  };

  return (
    <div>
      <p>房間：{guestNum}人</p>
      <Flex>
        <div>
          <p>大人</p>
          <SmallCaption>年齡20+</SmallCaption>
        </div>
        <CustomInputNumber
          name="adult"
          min={minAdultNum}
          max={maxGuestNum - allocation.child}
          step={customInputNumberStep}
          disabled={disabled}
          value={initAdultNum}
          onChange={onInputChange}
          onBlur={onInputBlur}
        />
      </Flex>
      <Flex>
        <p>小孩</p>
        <CustomInputNumber
          name="child"
          min={minChildNum}
          max={maxGuestNum - allocation.adult}
          step={customInputNumberStep}
          disabled={disabled}
          value={initChildNum}
          onChange={onInputChange}
          onBlur={onInputBlur}
        />
      </Flex>
    </div>
  );
};

Room.propTypes = {
  maxGuestNum: PropTypes.number.isRequired,
  minAdultNum: PropTypes.number.isRequired,
  minChildNum: PropTypes.number,
  initAdultNum: PropTypes.number.isRequired,
  initChildNum: PropTypes.number.isRequired,
  customInputNumberStep: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Room;
