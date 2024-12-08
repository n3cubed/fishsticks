import PlayPause from "./PlayPause";
import StartStop from "./StartStop";
import Step from "./Step";
import Speed from "./Speed";
import styles from './Controls.module.css';
import { useState } from 'react';
import Hotbar from "../Hotbar";


export default function Controls() {
  const [isStopped, setIsStopped] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [speedStep, setSpeedStep] = useState(1);

  return (
    <>
      <div className={styles.controls}>
          <StartStop isStopped={isStopped} setIsStopped={setIsStopped} setIsPaused={setIsPaused}/>
          <PlayPause isStopped={isStopped} isPaused={isPaused} setIsPaused={setIsPaused} />
          <Step      isStopped={isStopped} />
          <Speed     isStopped={isStopped} speed={speed} speedStep={speedStep} setSpeed={setSpeed} />
          <Hotbar />
      </div>
    </>
  );
}
