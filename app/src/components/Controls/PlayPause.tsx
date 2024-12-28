import { useState, SetStateAction } from "react";
import styles from "./Controls.module.css";
import { objects } from "../../creator.js";
import playSVG from "./play-solid.svg";
import pauseSVG from "./pause-solid.svg";

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
            <img className={`${styles.play} ${styles.button}`} src={playSVG} alt="play" />
          )}
          {!isPaused && (
            <img className={`${styles.pause} ${styles.button}`} src={pauseSVG} alt="pause" ></img>
          )}
        </div>
      )}
    </>
  );
}
