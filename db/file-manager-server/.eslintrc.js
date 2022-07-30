module.exports = {
    env: {
        es2016: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:import/recommended' ],
    plugins: ['import', 'sort-class-members', 'prettier'],
    rules: {
        indent: ['error', 4],

        'eol-last': ['error', 'always'],

        'object-property-newline': ['error', {allowAllPropertiesOnSameLine: true}],

        'comma-spacing': ['error', {before: false, after: true}],

        'object-curly-newline': ['error', {
            ObjectExpression: {multiline: true, minProperties: 3},
            ObjectPattern: {multiline: true},
            ImportDeclaration: 'never',
            ExportDeclaration: {multiline: true, minProperties: 3}
        }],

        semi: ['error'],

        'comma-dangle': ['error', 'never'],

        quotes: [
            'error',
            'single',
            {avoidEscape: true, allowTemplateLiterals: true}
        ],

        'quote-props': ['error', 'as-needed'],

        // Spacing
        'object-curly-spacing': ['error', 'never'],
        'no-trailing-spaces': 'error',

        camelcase: [
            'error',
            {
                allow: [
                    'UNSAFE_componentWillMount',
                    'UNSAFE_componentWillReceiveProps',
                    'UNSAFE_componentWillUpdate'
                ],
                properties: 'never'
            }
        ],

        // Allow assignment to properties of parameters, since that happens just very often in our code,
        // even though it's discouraged.
        'no-param-reassign': ['error', {props: false}],

        // This rule is replaced by the extension from flowtype below.
        'no-unused-expressions': ['error', {allowShortCircuit: true}],

        // Allow for-in loops. (Ideally, we'd be able to allow them only when they have an own-property safeguard).
        'no-restricted-syntax': [
            'error',
            'DebuggerStatement',
            // 'ForInStatement',
            'LabeledStatement',
            'WithStatement'
        ],

        // Allow global and eslint markers.
        'spaced-comment': [
            'error',
            'always',
            {
                exceptions: ['-', '+'],
                markers: ['=', '!', 'global', 'eslint', '::']
            }
        ],

        // Order of members in any class (including React component classes; so we need to define some exceptions for
        // those, e.g. requiring `props` and `state` before any other static members).
        'sort-class-members/sort-class-members': [
            'error',
            {
                order: [
                    {
                        name: 'modelName',
                        type: 'property',
                        static: true
                    },
                    '[properties]',
                    '[non-react-static-properties]',
                    '[static-methods]',
                    'constructor',
                    'initialize',
                    '/^initialize[A-Z].+$/',
                    '[methods]'
                ],
                accessorPairPositioning: 'getThenSet'
            }
        ],

        // Allow range checks like `('a' <= ch && ch <= 'z')`.
        yoda: ['error', 'never', {exceptRange: true}]
    },
    overrides: [
        {
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:import/typescript'
            ],
            plugins: ['@typescript-eslint'],
            parser: '@typescript-eslint/parser',
            files: ['*.ts', '*.tsx'],
            rules: {
                indent: 'off',
                '@typescript-eslint/indent': ['error', 4, {
                    MemberExpression: 1,
                    ignoredNodes: [
                        'FunctionExpression > .params[decorators.length > 0]',
                        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
                        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key'
                    ]
                }],

                semi: 'off',
                '@typescript-eslint/semi': ['error'],

                quotes: 'off',
                '@typescript-eslint/quotes': [
                    'error',
                    'single',
                    {
                        avoidEscape: true,
                        allowTemplateLiterals: true
                    }
                ],

                '@typescript-eslint/no-unsafe-member-access': 'off',

                'no-redeclare': 'off',
                '@typescript-eslint/no-redeclare': ['error'],

                'no-dupe-class-members': 'off',
                '@typescript-eslint/no-dupe-class-members': ['error'],

                'no-shadow': 'off',
                '@typescript-eslint/no-shadow': ['error'],

                'no-unused-vars': 'off',
                // Allow unused siblings in rest expressions, and variables that only consist of underscores
                // (to allow things like `const [__, ...rest] = list`)
                // or start with an uppercase character (for generic type arguments).
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    {
                        varsIgnorePattern: '_+|[A-Z]',
                        args: 'none',
                        ignoreRestSiblings: true
                    }
                ]
            },
            parserOptions: {project: ['./tsconfig.json']}
        }
    ]
};
