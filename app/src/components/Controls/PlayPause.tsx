import { useState, SetStateAction } from "react";
import styles from "./Controls.module.css";
import { objects } from "../../creator.js";

type props = {
  isStopped: boolean; 
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
};

export default function PlayPause({ isStopped, isPaused, setIsPaused }: props) {
  const pause = () => {
    objects.pause();
    console.log("pause");
    setIsPaused(true);
  };

  const play = () => {
    objects.play();
    console.log("play");
  };

  const handleClick = () => {
    isPaused ? play() : pause();
    setIsPaused(!isPaused);
  };

  return (
    <>
      {!isStopped && (
        <div onClick={handleClick}>
          {isPaused && (
            <div className={`${styles.play} ${styles.button}`}>Play</div>
          )}
          {!isPaused && (
            <div className={`${styles.pause} ${styles.button}`}>Pause</div>
          )}
        </div>
      )}
    </>
  );
}
