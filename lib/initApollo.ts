import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "apollo-boost";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
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

function create(hasSession: boolean | string, initialState?) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const headers: any = {};
  let loggedInUser = {
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
        __typename: "Me",
        ...loggedInUser,
      },
    },
    resolvers: { MeResolvers },
  });

  const httpLink = new HttpLink({
    uri: "http://localhost:4000/", // Server URL (must be absolute)
    headers,
  });

  const link = ApolloLink.from([stateLink, httpLink]);

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: link,
    cache: cache,
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
