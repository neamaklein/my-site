import { Fragment } from 'react';
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

// A chapter as a sheet laid over the one before (depth, per Neama).
function Page({ on, band, children }) {
  return on ? <div className={`${styles.page} ${band ? styles.bandPage : ''}`}>{children}</div> : children;
}

export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  // Depth (approved by Neama): on every project page each chapter is a
  // sheet laid over the one before. A project's `depth.breakout` (an
  // object breaking out between sheets) is still a trial, review copy only.
  const depth = project.depth || {};
  const breakout = REVIEW ? depth.breakout : null;

  // The Graphic Index (brand book) on its band. It sits after the intro,
  // or, with `brandBookBefore`, just before the gallery of that heading
  // (ACHOTI keeps its chapter order).
  const graphicIndex = project.brandBook && (
    <Page on={depth} band>
      <div className={styles.band}>
        <BrandBook {...project.brandBook} />
      </div>
    </Page>
  );

  return (
    <ReviewScope value={project.slug}>
      <article>
        <DispatchBar dispatchNumber={project.dispatchNumber} category={project.category} />
        <Hero {...project.hero} />
        <div className={`${styles.sheet} ${depth ? styles.depth : ''}`}>
          {/* Order, per Neama: title, facts and the description, then the
              strongest result, then the brand system, then its
              applications.
              Text sections sit on the inner (200px) line of the Figma grid;
              media sections run full width or on the outer (100px) line. */}
          <Page on={depth}>
            <PageContainer>
              <TitleBlock {...project.title} />
              {project.meta?.length > 0 && <MetaGrid items={project.meta} monoLabels={project.metaMonoLabels} />}
              {/* Per Neama: the description opens the page, right under the
                  facts, with no "Strategy" heading. */}
              {project.strategy && (
                <div className={styles.intro}>
                  <Strategy {...project.strategy} heading={undefined} />
                </div>
              )}
            </PageContainer>

            {project.feature === 'process' && project.process && <Process {...project.process} />}
            {project.feature && project.feature !== 'process' && <Feature {...project.feature} />}
          </Page>

          {project.brandBook && !project.brandBookBefore && graphicIndex}

          {project.process && project.feature !== 'process' && <Process {...project.process} />}
          {project.galleries?.map((gallery) => (
            <Fragment key={gallery.heading}>
              {project.brandBookBefore === gallery.heading && graphicIndex}
              <Page on={depth}>
                {breakout?.before === gallery.heading && (
                  <img className={styles.breakout} src={breakout.src} alt="" aria-hidden="true" />
                )}
                <Gallery {...gallery} />
              </Page>
            </Fragment>
          ))}
          {project.spatialRenders && <SpatialRenders {...project.spatialRenders} />}

          <CaseStudyFooter {...project.footer} dispatchNumber={project.dispatchNumber} />
        </div>
      </article>
    </ReviewScope>
  );
}
