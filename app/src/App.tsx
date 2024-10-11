import { Switch, Route } from 'wouter';

import pages from '@/pages';

const App = () => {
  return (
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
  );
};

export default App;
