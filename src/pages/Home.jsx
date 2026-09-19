import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home({ projects }) {
  return (
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
      </div>
    </main>
  );
}
