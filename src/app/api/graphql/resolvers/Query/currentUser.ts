import type { QueryResolvers } from './../../types.generated'
export const currentUser: NonNullable<QueryResolvers['currentUser']> = async (
  _parent,
  _arg,
  { db }
) => {
  const user = await db.getUser('123')
  return user
}
