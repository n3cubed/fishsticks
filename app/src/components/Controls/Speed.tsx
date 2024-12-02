import styles from './Controls.module.css';
import { useRef } from 'react';

type props = {
  isStopped: boolean
  speed: number;
  speedStep: number;
  setSpeed: (speed: number) => void;
};

export default function Speed({ isStopped, speed, speedStep, setSpeed }: props) {
  let inputRef = useRef(null);

  const speedDown = () => {
    inputRef.current.stepDown();
    setSpeed(inputRef.current.value);
  }
  const speedUp = () => {
    inputRef.current.stepUp();
    setSpeed(inputRef.current.value);
  }

  return (
    <>
      {isStopped && <div className={`${styles.speed} ${styles.button}`}>
        <div
          onClick={speedDown}
          className={styles['speed-down']}
        >
          &lt;
        </div>
        <input
          ref={inputRef}
          className={styles['speed-input']}
          type='number'
          step={speedStep}
          defaultValue={speed}
          min='0' />
        <div
          onClick={speedUp}
          className={styles['speed-up']}
        >
          &gt;
        </div>
      </div>}
    </>
  );
}
