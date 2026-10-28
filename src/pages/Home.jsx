import DispatchFilm from '../components/DispatchFilm.jsx';

// Per Neama: the home page is her Creative Dispatch film, played by
// scrolling; its departures board leads to each project. Nothing after it.

export default function Home({ projects }) {
  return <DispatchFilm projects={projects} />;
}
