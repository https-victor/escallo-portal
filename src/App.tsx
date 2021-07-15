import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './store/Global/GlobalState';
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { AuthProvider } from './store/Auth/AuthState';
import { CssBaseline } from '@material-ui/core';
import Routes from './store/routes';
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
import { onError } from '@apollo/client/link/error';
import useLocalStorageState from './utils/useLocalStorageState';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';
import { ptBR as ptBRCore } from '@material-ui/core/locale';
import { ptBR } from '@material-ui/data-grid';
// import { ptBR } from '@material-ui/data-grid';

export const App = (): any => {
  const [globalToken, setToken, refreshToken] = useLocalStorageState('token', null);

  function onSetToken(token: any) {
    setToken(token);
  }
  const errorLink = onError(({ graphqlErrors }: any) => {
    if (graphqlErrors) {
      graphqlErrors.map(({ message }: any) => {
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

    if (refreshToken()) {
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

  const theme = createMuiTheme(
    {
      palette: {
        primary: { main: '#1976d2' }
      }
    },
    ptBR,
    ptBRCore
  );

  const GlobalCss = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
      // You should target [class*="MuiButton-root"] instead if you nest themes.
      '.MuiDataGrid-root .MuiDataGrid-columnHeaderWrapper': {
        overflow: 'initial'
      }
    }
  })(() => null);

  return (
    <Router>
      <CssBaseline />
      <GlobalCss />
      <ThemeProvider theme={theme}>
        <GlobalProvider token={globalToken} onSetToken={onSetToken}>
          <ApolloProvider client={client}>
            <AuthProvider>
              <div className="App">
                <Routes />
              </div>
            </AuthProvider>
          </ApolloProvider>
        </GlobalProvider>
      </ThemeProvider>
    </Router>
  );
};
