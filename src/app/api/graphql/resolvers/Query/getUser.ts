import type { QueryResolvers } from './../../types.generated'
export const getUser: NonNullable<QueryResolvers['getUser']> = async (
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
