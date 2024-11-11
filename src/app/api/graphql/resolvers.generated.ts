/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import type { Resolvers } from './types.generated'
import { currentUser as Query_currentUser } from './resolvers/Query/currentUser'
import { getUser as Query_getUser } from './resolvers/Query/getUser'
import { hello as Query_hello } from './resolvers/Query/hello'
import { User } from './resolvers/User'
export const resolvers: Resolvers = {
  Query: {
    currentUser: Query_currentUser,
    getUser: Query_getUser,
    hello: Query_hello,
  },

  User: User,
}
