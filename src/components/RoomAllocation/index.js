import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Room from "../Room";
import styled from "styled-components";

const Container = styled.div`
  font-size: 16px;
  border: 1px solid rgb(30, 159, 210);
  width: 300px;
  padding: 20px;
  margin: 20px 0;
  border-radius: 4px;
`;

const RoomList = styled.div`
  & > *:not(:last-child) {
    border-bottom: 2px solid #e1e1e1;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
`;

const MAX_GUEST_NUM_IN_ROOM = 4;

const RoomAllocation = (props) => {
  const { guest, room, onChange } = props;
  const [disabled] = useState(guest === room);
  const [allocatedGuestNum, setAllocatedGuestNum] = useState(3);
  const [allocations, setAllocations] = useState(
    Array.from({ length: room }, () => ({
      adult: 1,
      child: 0,
    }))
  );

  const [maxGuestAlloc, setMaxGuestAlloc] = useState(
    Array.from({ length: room }).fill(MAX_GUEST_NUM_IN_ROOM)
  );

  useEffect(() => {
    onChange(allocations);

    // update total allocated guest num
    let _allocatedGuestNum = 0;
    allocations.forEach((alloc) => {
      _allocatedGuestNum = _allocatedGuestNum + alloc.adult + alloc.child;
    });
    setAllocatedGuestNum(_allocatedGuestNum);

    // update max guest num of each room
    setMaxGuestAlloc(
      allocations.map((alloc) =>
        Math.min(
          MAX_GUEST_NUM_IN_ROOM,
          alloc.adult + alloc.child + guest - _allocatedGuestNum
        )
      )
    );
  }, [allocations]);

  const onRoomChange = (result, roomIndex) => {
    setAllocations((prevAllocations) => {
      const newAlloc = Array.from(prevAllocations);
      newAlloc[roomIndex] = { ...result };
      return newAlloc;
    });
  };

  return (
    <Container>
      <p>
        住客人數：{guest}人 / {room}房
      </p>
      <p>尚未分配人數：{guest - allocatedGuestNum}人</p>
      <RoomList>
        {allocations.map((allocation, index) => {
          return (
            <Room
              key={index}
              maxGuestNum={maxGuestAlloc[index]}
              minAdultNum={1}
              minChildNum={0}
              initAdultNum={allocation.adult}
              initChildNum={allocation.child}
              customInputNumberStep={1}
              disabled={disabled}
              onChange={(result) => {
                onRoomChange(result, index);
              }}
            />
          );
        })}
      </RoomList>
    </Container>
  );
};

RoomAllocation.propTypes = {
  guest: PropTypes.number.isRequired,
  room: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RoomAllocation;
