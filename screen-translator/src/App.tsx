import { useEffect, useState } from 'react';
import Overlay from './components/Overlay';
import ResultPopup from './components/ResultPopup';
import Settings from './components/Settings';
import PermissionPrompt from './components/PermissionPrompt';
import History from './components/History';
import Onboarding from './components/Onboarding';

type Route = 'overlay' | 'result' | 'settings' | 'permission' | 'history' | 'onboarding' | 'idle';

function getRoute(): Route {
  const hash = window.location.hash;
  if (hash.includes('/overlay')) return 'overlay';
  if (hash.includes('/result')) return 'result';
  if (hash.includes('/settings')) return 'settings';
  if (hash.includes('/permission')) return 'permission';
  if (hash.includes('/history')) return 'history';
  if (hash.includes('/onboarding')) return 'onboarding';
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
    case 'history':
      return <History />;
    case 'onboarding':
      return <Onboarding />;
    default:
      return null;
  }
}
