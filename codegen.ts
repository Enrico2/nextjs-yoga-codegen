import type { CodegenConfig } from '@graphql-codegen/cli'
import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/app/api/graphql/schema.graphql',
  generates: {
    'src/app/api/graphql': defineConfig({
      typesPluginsConfig: {
        contextType: './models#Context',
      },
    }),
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
