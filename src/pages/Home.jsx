import { Link } from 'react-router-dom';
import { comingSoon } from '../data/projects/index.js';
import DispatchFilm from '../components/DispatchFilm.jsx';
import styles from './Home.module.css';

// Per Neama: the home page opens on her Creative Dispatch film, played by
// scrolling; the dispatch list follows it.

export default function Home({ projects }) {
  return (
    <>
      <DispatchFilm projects={projects} />
      <main className={styles.wrap}>
        <h1 className={styles.title}>Neama Klein</h1>
        <p className={styles.subtitle}>TERMINAL // SELECT DISPATCH</p>
        <div className={styles.list}>
          {projects.map((project) => (
            <Link key={project.slug} to={`/work/${project.slug}`} className={styles.row}>
              <span>{project.title.name}</span>
              <span className={styles.meta}>
                DISPATCH № {project.dispatchNumber} // {project.category}
              </span>
            </Link>
          ))}
          {comingSoon.map((item) => (
            <div key={item.dispatchNumber} className={`${styles.row} ${styles.pending}`}>
              <span>— — — —</span>
              <span className={styles.meta}>DISPATCH № {item.dispatchNumber} // COMING_SOON</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
