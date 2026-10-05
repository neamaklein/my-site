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
import Gallery from '../components/Gallery.jsx';
import SpatialRenders from '../components/SpatialRenders.jsx';
import CaseStudyFooter from '../components/CaseStudyFooter.jsx';
import { ReviewScope } from '../review/ReviewProvider.jsx';
import styles from './CaseStudy.module.css';

export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <ReviewScope value={project.slug}>
      <article>
        <DispatchBar dispatchNumber={project.dispatchNumber} category={project.category} />
        <Hero {...project.hero} />
        <div className={styles.sheet}>
          {/* Text sections sit on the inner (200px) line of the Figma grid. */}
          <PageContainer>
            <TitleBlock {...project.title} />
            {project.meta?.length > 0 && <MetaGrid items={project.meta} />}
            {project.strategy && <Strategy {...project.strategy} />}
            {project.brandBook && <BrandBook {...project.brandBook} />}
          </PageContainer>

          {/* Media sections run full width / on the outer (100px) line, and
              set their own padding. */}
          {project.process && <Process {...project.process} />}
          {project.galleries?.map((gallery) => (
            <Gallery key={gallery.heading} {...gallery} />
          ))}
          {project.spatialRenders && <SpatialRenders {...project.spatialRenders} />}
          <CaseStudyFooter {...project.footer} />
        </div>
      </article>
    </ReviewScope>
  );
}
