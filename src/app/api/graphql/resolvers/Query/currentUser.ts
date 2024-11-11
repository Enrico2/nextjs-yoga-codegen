import type { QueryResolvers } from './../../types.generated'
export const currentUser: NonNullable<QueryResolvers['currentUser']> = async (
  _parent,
  _arg,
  _ctx
) => {
  return {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
  }
}
