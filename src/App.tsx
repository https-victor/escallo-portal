import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './store/Global/GlobalState';
// import axios from 'axios';

import { AuthProvider } from './store/Auth/AuthState';
import { CssBaseline } from '@material-ui/core';
import Routes from './store/routes';
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
export const App = ({ props }: any): any => {
  return (
    <Router>
      <CssBaseline />
      <GlobalProvider>
        <AuthProvider>
          <div className="App">
            <Routes />
          </div>
        </AuthProvider>
      </GlobalProvider>
    </Router>
  );
};
