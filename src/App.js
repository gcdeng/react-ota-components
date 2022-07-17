import React from "react";
import CustomInputNumber from "./components/CustomInputNumber";
import RoomAllocation from "./components/RoomAllocation";

const App = () => {
  const onInputChange = (event) => {
    console.log(event.target.name, event.target.value);
  };
  const onInputBlur = (event) => {
    console.log(event.target.name, event.target.value);
  };
  const onRoomAllocationChange = (result) => {
    console.log(result);
  };

  return (
    <>
      <CustomInputNumber
        name="test-input"
        min={0}
        max={5}
        step={2}
        disabled={false}
        value={0}
        onChange={onInputChange}
        onBlur={onInputBlur}
      />
      <RoomAllocation guest={10} room={3} onChange={onRoomAllocationChange} />
    </>
  );
};

export default App;
