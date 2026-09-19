import { Link } from 'react-router-dom';
import styles from './CaseStudyFooter.module.css';

export default function CaseStudyFooter({ label, returnLabel }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <Link to="/" className={styles.button}>
        {returnLabel}
      </Link>
    </div>
  );
}
