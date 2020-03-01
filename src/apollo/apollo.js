import { ApolloClient,InMemoryCache,HttpLink } from "apollo-boost";

const cache = new InMemoryCache();
const httpLink  = new HttpLink({
  uri: "http://localhost:3001/graphql", credentials:'include'
});



const client = new ApolloClient({
  cache,
  link:httpLink
});


export default client;