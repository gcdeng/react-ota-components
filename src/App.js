import React from "react";
import CustomInputNumber from "./components/CustomInputNumber";

const App = () => {
  const onInputChange = (e) => {
    console.log(e.target.name, e.target.value);
  };
  const onInputBlur = (e) => {
    console.log(e.target.name, e.target.value);
  };
  return (
    <CustomInputNumber
      name="test-input"
      min={0}
      max={30}
      step={1}
      value={0}
      disabled={false}
      onChange={onInputChange}
      onBlur={onInputBlur}
    />
  );
};

export default App;
