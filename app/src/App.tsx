import { Switch, Route } from 'wouter';
import { routes } from '@/pages';
import { PopupProvider } from './pages/Home/components/PopUpContext';

const App = () => {
  return (
    <PopupProvider>
      <Switch>
        {routes.map((route, i) => (
          <Route
            key={i}
            path={route.href}
            component={route.component as any}
          />
        ))}
      </Switch>
    </PopupProvider>
  );
};

export default App;
