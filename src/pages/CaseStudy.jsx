import { useParams, Navigate } from 'react-router-dom';
import { getProjectBySlug } from '../data/projects/index.js';
import DispatchBar from '../components/DispatchBar.jsx';
import Hero from '../components/Hero.jsx';
import PageContainer from '../components/PageContainer.jsx';
import TitleBlock from '../components/TitleBlock.jsx';
import MetaGrid from '../components/MetaGrid.jsx';
import Strategy from '../components/Strategy.jsx';
import BrandBook from '../components/BrandBook.jsx';
import Gallery from '../components/Gallery.jsx';
import SpatialRenders from '../components/SpatialRenders.jsx';
import CaseStudyFooter from '../components/CaseStudyFooter.jsx';

export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <article>
      <DispatchBar dispatchNumber={project.dispatchNumber} category={project.category} />
      <Hero {...project.hero} />
      <PageContainer>
        <TitleBlock {...project.title} />
        <MetaGrid items={project.meta} />
        <Strategy {...project.strategy} />
        <BrandBook {...project.brandBook} />
        {project.galleries.map((gallery) => (
          <Gallery key={gallery.heading} {...gallery} />
        ))}
        {project.spatialRenders && <SpatialRenders {...project.spatialRenders} />}
      </PageContainer>
      <CaseStudyFooter {...project.footer} />
    </article>
  );
}
