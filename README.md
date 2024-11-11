This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Adding GraphQL

```shell
npx create-next-app@latest .
rm package-lock.json
yarn install
yarn add graphql-yoga graphql
yarn add --dev @graphql-codegen/cli @eddeee888/gcg-typescript-resolver-files @parcel/watcher
```

created schema in `src/app/api/graphql/schema.graphql`

```shell
npx graphql-code-generator init
ERROR: TypeError: stripAnsi is not a function
```

```shell
yarn add -D strip-ansi
```

```shell
npx graphql-code-generator init
ERROR: TypeError: stringWidth is not a function
```

```shell
yarn add -D string-width
ERROR: TypeError: stringWidth is not a function
```

```shell
# Remove existing node_modules and lock files
rm -rf node_modules package-lock.json yarn.lock

# Install dependencies using Yarn
yarn install

# Try running the codegen again
yarn graphql-codegen init
```

(This time it worked…)

```shell
? What type of application are you building? Application built with React
? Where is your schema?: (path or url) src/app/schema/schema.graphql
? Where are your operations and fragments?: src/**/*.tsx
? Where to write the output: src/app/graphql
? Do you want to generate an introspection file? No
? How to name the config file? codegen.ts
? What script in package.json should run the codegen? codegen
```

```shell
> yarn codegen
Unable to find any GraphQL type definitions for the following pointers:
      - src/**/*.tsx
```

Deleted documents: `"src/**/*.tsx",` From `codegen.ts`

```shell
> yarn codegen
```

Errored with

```
[client-preset] target output should be a directory, ex: "src/gql/". Make sure you add "/" at the end of the directory path
```

The `codegen.ts` file that is generated doesn’t have a `/` suffix, but I don’t want the client preset anyway, changing `codegen.ts` to be:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli'
import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/app/api/graphql/schema.graphql',
  generates: {
    'src/app/api/graphql': defineConfig(),
  },
}

export default config
```

`// src/app/api/graphql/route.ts`

(This is actually different than https://the-guild.dev/graphql/yoga-server/docs/integrations/integration-with-nextjs)

```typescript
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
  return handleRequest(request, {}) // specifically this is the difference
}

export async function POST(request: NextRequest) {
  return handleRequest(request, {})
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request, {})
}
```

```shell
yarn build
```

fails with a bunch of eslint errors in the generated files. Need to add this in the main object in `.eslintrc.json`:

```json
"rules": {
  "semi": ["error", "never"],
  "@typescript-eslint/no-unused-vars": [
    "error",
    { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
  ]
},
"overrides": [
    {
      "files": ["**/*.generated.ts"],
      "rules": {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-object-type": "off"
      }
    }
  ]
```

```shell
yarn build
```

doesn't compile obviously because we didn't add any resolvers.

```
./src/app/api/graphql/resolvers/Query/currentUser.ts:3:22
Type error: Type '(_parent: {}, _arg: {}, _ctx: any) => Promise<void>' is not assignable to type 'NonNullable<Resolver<Maybe<ResolverTypeWrapper<User>>, {}, any, {}> | undefined>'.
  Type '(_parent: {}, _arg: {}, _ctx: any) => Promise<void>' is not assignable to type 'ResolverFn<Maybe<ResolverTypeWrapper<User>>, {}, any, {}>'.
    Type 'Promise<void>' is not assignable to type 'Maybe<ResolverTypeWrapper<User>> | Promise<Maybe<ResolverTypeWrapper<User>>>'.
      Type 'Promise<void>' is not assignable to type 'Promise<User>'.
        Type 'void' is not assignable to type 'User'.

  1 |
  2 |         import type   { QueryResolvers } from './../../types.generated';
> 3 |         export const currentUser: NonNullable<QueryResolvers['currentUser']> = async (_parent, _arg, _ctx) => { /* Implement Query.currentUser resolver logic here */ };
```

I added resolver implementations to just return some data where needed.

```typescript
return {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
}
```

run `yarn build` again and it failed on linting... so we add `prettier` and apply it.

```shell
yarn add -D prettier
```

create `.prettierrc.json`

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "importOrder": [
    "^react",
    "^@core/(.*)$",
    "^@server/(.*)$",
    "^@ui/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true
}
```

run prettier on the codebase

```shell
yarn prettier --write .
```

run `yarn build` again and it works.

run `yarn dev` and and open http://localhost:3000/api/graphql

### Adding a Context object

If you look at the commit history, the first commit covers everything up to this point. See the following commit for adding the context object.

1. create `src/app/api/graphql/models.ts`
2. update `codegen.ts` to reference the new context object
3. run `yarn codegen` again
4. in your resolvers you can replace `_ctx` with `{ db }`
5. in `route.ts` you need to pass the context object to the yoga server
6. See the `currentUser` resolver for an example
