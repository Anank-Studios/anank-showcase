import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Regras do projeto: ver specs/00-arquitetura.md
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message: 'Proibido no projeto. Use estado React ou Context.',
        },
        {
          name: 'sessionStorage',
          message: 'Proibido no projeto. Use estado React ou Context.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/apps/api/**', '@anank/api', '@anank/api/*'],
              message:
                'O front nunca importa dados do backend. Use shared/lib/api.ts (fetch HTTP).',
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];

export default config;
