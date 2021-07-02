import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './store/Global/GlobalState';
import Routes from './store/routes';
import './styles/css/style.css';
// import axios from 'axios';

import { AuthProvider } from './store/Auth/AuthState';
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
export const App = ({ props }: any): any => {
  return (
    <Router>
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
