import styles from './styles/page.css';
import Gui from './components/Gui'

export default function Home() {
  return (
    <main className={styles.main}>
      <Gui />
    </main>
  );
}