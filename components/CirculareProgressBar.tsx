"use client";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CirculareProgressBar = ({ value }: { value: number }) => {
  return (
    <>
      <CircularProgressbar
        value={value}
        maxValue={100}
        text={value.toString()}
      />
    </>
  );
};

export default CirculareProgressBar;
