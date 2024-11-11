export type Context = {
  db: Database
}

// this should be in a database package but this is just for tutorial purposes
export type DBUser = {
  id: string
  name: string
  email: string
}

export interface Database {
  getUser: (id: string) => Promise<DBUser | null>
}

export const fakeDatabase: Database = {
  getUser: async (id: string): Promise<DBUser | null> => {
    return {
      id,
      name: 'Not John Doe',
      email: 'not.john.doe@example.com',
    }
  },
}
