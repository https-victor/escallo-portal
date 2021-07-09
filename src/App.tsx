import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './store/Global/GlobalState';
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { AuthProvider } from './store/Auth/AuthState';
import { CssBaseline } from '@material-ui/core';
import Routes from './store/routes';
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
import { onError } from '@apollo/client/link/error';
import useLocalStorageState from './utils/useLocalStorageState';
export const App = ({ props }: any): any => {
  const [globalToken, setToken] = useLocalStorageState('token', null);

  function onSetToken(token: any) {
    setToken(token);
  }
  const errorLink = onError(({ graphqlErrors, networkError }: any) => {
    if (graphqlErrors) {
      graphqlErrors.map(({ message, location, path }: any) => {
        console.error(`Graphql error ${message}`);
      });
    }
  });
  const addToken = new ApolloLink((operation, forward) => {
    return forward(operation).map((response: any) => {
      const { response: res } = operation.getContext();
      const { headers, status } = res;
      const token = headers.get('Authorization') || null;
      if (token) {
        onSetToken(token);
        if (response.data) {
          response.data.token = token;
        }
      } else {
        onSetToken(null);
      }
      if (response.data) {
        response.data.status = status;
      }
      return response;
    });
  });
  const authMiddleware = new ApolloLink((operation: any, forward: any): any => {
    // add the authorization to the headers
    if (globalToken) {
      operation.setContext(({ headers = {} }: any) => ({
        headers: {
          ...headers,
          Authorization: globalToken || undefined
        }
      }));
    }

    return forward(operation);
  });
  const link = from([errorLink, addToken, authMiddleware, new HttpLink({ uri: 'http://172.20.50.47:4000/graphql' })]);
  const client = new ApolloClient({ link: link, cache: new InMemoryCache() });
  return (
    <Router>
      <CssBaseline />

      <GlobalProvider token={globalToken} onSetToken={onSetToken}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <div className="App">
              <Routes />
            </div>
          </AuthProvider>
        </ApolloProvider>
      </GlobalProvider>
    </Router>
  );
};
