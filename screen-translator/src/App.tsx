import { useEffect, useState } from 'react';
import Overlay from './components/Overlay';
import ResultPopup from './components/ResultPopup';

type Route = 'overlay' | 'result' | 'idle';

function getRoute(): Route {
  const hash = window.location.hash;
  if (hash.includes('/overlay')) return 'overlay';
  if (hash.includes('/result')) return 'result';
  return 'idle';
}

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route === 'overlay') return <Overlay />;
  if (route === 'result') return <ResultPopup />;

  return null;
}
