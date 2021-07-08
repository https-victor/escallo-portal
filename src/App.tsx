import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './store/Global/GlobalState';
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { AuthProvider } from './store/Auth/AuthState';
import { CssBaseline } from '@material-ui/core';
import Routes from './store/routes';
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
import { onError } from '@apollo/client/link/error';
export const App = ({ props }: any): any => {
  const errorLink = onError(({ graphqlErrors, networkError }: any) => {
    if (graphqlErrors) {
      graphqlErrors.map(({ message, location, path }: any) => {
        alert(`Graphql error ${message}`);
      });
    }
  });
  const addToken = new ApolloLink((operation, forward) => {
    return forward(operation).map((response: any) => {
      const { response: res } = operation.getContext();
      const { headers, status } = res;
      const token = headers.get('X-Powered-By') || null;
      console.log(headers.keys());
      response.data.token = token;
      return response;
    });
  });
  // const authMiddleware = new ApolloLink((operation: any, forward: any): any => {
  //   // add the authorization to the headers
  //   operation.setContext(({ headers = {} }: any) => ({
  //     headers: {
  //       ...headers,
  //       authorization: localStorage.getItem('token') || null
  //     }
  //   }));

  //   return forward(operation);
  // });
  const link = from([errorLink, addToken, new HttpLink({ uri: 'http://172.20.50.47:4000/graphql' })]);
  const client = new ApolloClient({ link: link, cache: new InMemoryCache() });
  return (
    <Router>
      <CssBaseline />
      <ApolloProvider client={client}>
        <GlobalProvider>
          <AuthProvider>
            <div className="App">
              <Routes />
            </div>
          </AuthProvider>
        </GlobalProvider>
      </ApolloProvider>
    </Router>
  );
};
