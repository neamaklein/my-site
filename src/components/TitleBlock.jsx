import styles from './TitleBlock.module.css';

// Per Neama: the small tag line above the name is not shown (the details row
// under it already says the same). `tag` stays in each project's data.
// eslint-disable-next-line no-unused-vars
export default function TitleBlock({ tag, name, tagline }) {
  return (
    <div className={styles.wrap}>
      <h1 className={`${styles.name} reveal serif-name`}>{name}</h1>
      {tagline && <p className={`${styles.tagline} serif-voice`}>{tagline}</p>}
    </div>
  );
}
