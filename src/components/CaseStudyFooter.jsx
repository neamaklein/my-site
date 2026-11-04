import { Link } from 'react-router-dom';
import styles from './CaseStudyFooter.module.css';

// The return link resumes the home film at this project's station.
export default function CaseStudyFooter({ label, returnLabel, dispatchNumber }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <Link to="/" state={{ station: dispatchNumber }} className={`${styles.button} serif-section`}>
        {returnLabel}
      </Link>
    </div>
  );
}
