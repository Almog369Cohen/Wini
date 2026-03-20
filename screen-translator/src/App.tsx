import { useEffect, useState } from 'react';
import Overlay from './components/Overlay';
import ResultPopup from './components/ResultPopup';
import Settings from './components/Settings';
import PermissionPrompt from './components/PermissionPrompt';

type Route = 'overlay' | 'result' | 'settings' | 'permission' | 'idle';

function getRoute(): Route {
  const hash = window.location.hash;
  if (hash.includes('/overlay')) return 'overlay';
  if (hash.includes('/result')) return 'result';
  if (hash.includes('/settings')) return 'settings';
  if (hash.includes('/permission')) return 'permission';
  return 'idle';
}

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  switch (route) {
    case 'overlay':
      return <Overlay />;
    case 'result':
      return <ResultPopup />;
    case 'settings':
      return <Settings />;
    case 'permission':
      return <PermissionPrompt />;
    default:
      return null;
  }
}
