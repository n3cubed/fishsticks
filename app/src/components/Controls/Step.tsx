import styles from './Controls.module.css';
import { objects } from 'api';

type props = {
  isStopped: boolean;
}

export default function Step({isStopped}: props) {
  const step = () => {
    objects.step()
  }
  return (
    <>
      {!isStopped && <div onClick={step} className={`${styles.step} ${styles.button}`}>
        Step
      </div>}
    </>
  );
}
