import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "apollo-boost";
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws'
import ws from 'ws';
import fetch from "isomorphic-unfetch";
import { MeResolvers } from "../resolvers/me";
import jwtDecode from "jwt-decode";

interface Proc {
  browser: boolean;
}
declare var process: Proc;
interface Global {
  fetch: any;
}
declare var global: Global;

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

interface User {
  id: string | null,
  photo?: string,
  name?: string,
  isAdmin?: boolean,
}

function create(hasSession: boolean | string, initialState?): ApolloClient<NormalizedCacheObject> {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const headers: any = {};
  let loggedInUser: User = {
    id: null,
  };

  if (hasSession) {
    headers.Authorization = hasSession;
    loggedInUser = jwtDecode(hasSession);
  }
  const cache = new InMemoryCache().restore(initialState || {});

  const stateLink = withClientState({
    cache,
    defaults: {
      me: {
        __typename: "User",
        ...loggedInUser,
      },
    },
    resolvers: { MeResolvers },
  });

  const httpLink = new HttpLink({
    uri: "http://localhost:4000/", // Server URL (must be absolute)
    headers,
  });

  const defaultLink = ApolloLink.from([stateLink, httpLink]);

  let websocketSubscription;
  if (typeof (window) !== "undefined") {
    websocketSubscription = new SubscriptionClient('ws://localhost:4000/', {
      reconnect: true,
      connectionParams: {
        Authorization: hasSession
      },
    })
  } else {
    websocketSubscription =
      websocketSubscription = new SubscriptionClient('ws://localhost:4000/', {
        reconnect: true,
        connectionParams: {
          Authorization: hasSession
        },
      }, ws);
  }

  const wsLink = new WebSocketLink(websocketSubscription);
  const link = split(
    // split based on operation type. If true, use websocket link, else, use normal link
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    defaultLink,
  );

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache,
  });
}

export default function initApollo(
  hasSession: boolean | string,
  initialState?,
): ApolloClient<NormalizedCacheObject> {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(hasSession, initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(hasSession, initialState);
  }

  return apolloClient;
}
