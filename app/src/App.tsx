import { Switch, Route } from 'wouter';
import { routes } from '@/pages';

const App = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Switch>
        {
          routes.map((route, i) => (
            <Route
              key={i}
              path={route.href}
              component={route.component as any}
            />
          ))
        }
      </Switch>
    </div>
  );
};

export default App;
