"use client";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CirculareProgressBar = ({ value }: { value: number }) => {
  return (
    <>
      <CircularProgressbar
        value={value}
        maxValue={100}
        text={value.toString()}
        // styles={buildStyles({
        //   pathColor: `rgba(62, 152, 199, ${value / 100})`,
        //   textColor: "#f88",
        //   trailColor: "#d6d6d6",
        //   backgroundColor: "#3e98c7",
        // })}
      />
    </>
  );
};

export default CirculareProgressBar;
