import { Link } from 'react-router-dom';
import styles from './DispatchBar.module.css';

export default function DispatchBar({ dispatchNumber, category }) {
  return (
    <div className={styles.bar}>
      <Link to="/" className={styles.back}>
        <span aria-hidden="true">←</span>
        <span>BACK_TO_TERMINAL</span>
      </Link>
      {dispatchNumber && (
        <div className={`mono-tag ${styles.tag}`}>
          <span>DISPATCH № {dispatchNumber}</span>
          <span>//</span>
          <span>{category}</span>
        </div>
      )}
    </div>
  );
}
