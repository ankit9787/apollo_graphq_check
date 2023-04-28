const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer} = require('@apollo/server/standalone')
const fs = require('fs');

const typeDefs =`#graphql

type Query {
  hello: String
  filterCheck: FilterCheck
}

type FilterCheck {
  filters: [Filter]
}

type PostalCode {
  postalCodes: String
}

type YearDate {
  value: String
}

type Filter {
  fieldName: String
  values: [FilterType]
}

union FilterType = YearDate | PostalCode

`;

const resolvers = {
  FilterType: {
    __resolveType(filterType) {
      if (filterType.postalCodes) {
        return "PostalCode";
      }
      return "YearDate";
    },
  },

  YearDate: {
    value: (value) => value
  },

  Query: {
    hello: () => 'Hello world!',
    filterCheck: () => {
      const rawData = fs.readFileSync('./example.json');
      const data = JSON.parse(rawData);
      return data;
    }
  },
};


const server = new ApolloServer({ typeDefs, resolvers,
   });
  const { url } = startStandaloneServer(server, {
    listen: { port: 4003 },
  });
  console.log(`🚀  Server ready }`);
