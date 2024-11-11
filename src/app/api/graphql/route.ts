import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from './typeDefs.generated'
import { resolvers } from './resolvers.generated'
import { NextRequest } from 'next/server'

const schema = createSchema({ typeDefs, resolvers })

const { handleRequest } = createYoga({
  schema,
  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: '/api/graphql',

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
})

export async function GET(request: NextRequest) {
  return handleRequest(request, {})
}

export async function POST(request: NextRequest) {
  return handleRequest(request, {})
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request, {})
}
