import { Switch, Route } from 'wouter';

import pages from '@/pages';

const App = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Switch>
      {
        pages.map(page => (
          <Route
            key={page.href}
            path={page.href}
            component={page.component}
          />
        ))
      }
      </Switch>
    </div>
  );
};

export default App;
