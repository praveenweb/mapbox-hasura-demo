import React from 'react';

import Header from './Header';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import Mapbox from './Mapbox';

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://hasura-mapbox-remote-join.herokuapp.com/v1/graphql',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }),
    cache: new InMemoryCache(),
  });
 };

const App = ({auth}) => {
  const client = createApolloClient(auth.idToken);
  return (
    <ApolloProvider client={client}>
      <div>
        <Header logoutHandler={auth.logout} />
        <div className="container-fluid p-left-right-0">
          <div className="col-xs-12 col-md-12 p-left-right-0">
            <Mapbox />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
