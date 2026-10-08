import { useParams, Navigate } from 'react-router-dom';
import { getProjectBySlug } from '../data/projects/index.js';
import DispatchBar from '../components/DispatchBar.jsx';
import Hero from '../components/Hero.jsx';
import PageContainer from '../components/PageContainer.jsx';
import TitleBlock from '../components/TitleBlock.jsx';
import MetaGrid from '../components/MetaGrid.jsx';
import Strategy from '../components/Strategy.jsx';
import BrandBook from '../components/BrandBook.jsx';
import Process from '../components/Process.jsx';
import Feature from '../components/Feature.jsx';
import Gallery from '../components/Gallery.jsx';
import SpatialRenders from '../components/SpatialRenders.jsx';
import CaseStudyFooter from '../components/CaseStudyFooter.jsx';
import { ReviewScope } from '../review/ReviewProvider.jsx';
import { REVIEW } from '../review/flags.js';
import styles from './CaseStudy.module.css';

// A chapter as a sheet (depth trial); without the trial, just its content.
function Page({ on, band, children }) {
  return on ? <div className={`${styles.page} ${band ? styles.bandPage : ''}`}>{children}</div> : children;
}

export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  // Depth trial (review copy only): on every project page each chapter
  // becomes a sheet laid over the one before; a project's `depth` adds
  // its own layered moments (a word behind an object, a breakout).
  const depth = REVIEW ? project.depth || {} : null;

  return (
    <ReviewScope value={project.slug}>
      <article>
        <DispatchBar dispatchNumber={project.dispatchNumber} category={project.category} stripes={project.stripes} />
        <Hero {...project.hero} />
        <div className={`${styles.sheet} ${depth ? styles.depth : ''}`}>
          {/* Order, per Neama: concept in one line (the title block's
              tagline), then the strongest result, then the brand system,
              then its applications; the full story text closes the page.
              Text sections sit on the inner (200px) line of the Figma grid;
              media sections run full width or on the outer (100px) line. */}
          <Page on={depth}>
            <PageContainer>
              <TitleBlock {...project.title} />
              {project.meta?.length > 0 && <MetaGrid items={project.meta} />}
            </PageContainer>

            {project.feature === 'process' && project.process && <Process {...project.process} />}
            {project.feature && project.feature !== 'process' && <Feature {...project.feature} word={depth?.word} />}
          </Page>

          {project.brandBook && (
            <Page on={depth} band>
              <div className={styles.band}>
                <BrandBook {...project.brandBook} />
              </div>
            </Page>
          )}

          {project.process && project.feature !== 'process' && <Process {...project.process} />}
          {project.galleries?.map((gallery) => (
            <Page on={depth} key={gallery.heading}>
              {depth?.breakout?.before === gallery.heading && (
                <img className={styles.breakout} src={depth.breakout.src} alt="" aria-hidden="true" />
              )}
              <Gallery {...gallery} />
            </Page>
          ))}
          {project.spatialRenders && <SpatialRenders {...project.spatialRenders} />}

          {project.strategy && (
            <PageContainer>
              <div className={styles.story}>
                <Strategy {...project.strategy} />
              </div>
            </PageContainer>
          )}
          <CaseStudyFooter {...project.footer} />
        </div>
      </article>
    </ReviewScope>
  );
}
