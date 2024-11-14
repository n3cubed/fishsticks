import styles from './styles/page.css';
import Gui from './components/Gui'
import useScript from './hooks/useScript'

export default function Home() {
  useScript('https://pixijs.download/v7.3.1/pixi.js');
  useScript('https://unpkg.com/mathjs@10.4.0/lib/browser/math.js');

  return (
    <main className={styles.main}>
        <Gui/>
    </main>
  );
}