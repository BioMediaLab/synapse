import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "apollo-boost";
import { getMainDefinition } from "apollo-utilities";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

interface IProc {
  browser: boolean;
}
declare var process: IProc;
interface IGlobal {
  fetch: any;
}
declare var global: IGlobal;

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

const ssrMode = !process.browser;

function create(
  hasSession: boolean | string,
  initialState?,
): ApolloClient<NormalizedCacheObject> {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const headers: any = {};

  if (hasSession) {
    headers.Authorization = hasSession;
  }

  const cache = new InMemoryCache().restore(initialState || {});

  const httpLink = new HttpLink({
    uri: publicRuntimeConfig.API_GRAPHQL_URL, // Server URL (must be absolute)
    headers,
  });

  const defaultLink = ApolloLink.from([httpLink]);

  let link = defaultLink;

  let websocketSubscription;
  if (!ssrMode) {
    websocketSubscription = new SubscriptionClient(
      publicRuntimeConfig.WEBSOCKET_URL,
      {
        reconnect: true,
        connectionParams: {
          Authorization: hasSession,
        },
      },
    );

    const wsLink = new WebSocketLink(websocketSubscription);
    link = split(
      // split based on operation type. If true, use websocket link, else, use normal link
      ({ query }) => {
        // possible types problem here:
        const { kind, operation } = getMainDefinition(query) as any;
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      defaultLink,
    );
  }

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
