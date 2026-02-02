import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        rules: {
            indent: ['error', 4, { SwitchCase: 1 }],
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'never',
                },
            ],
        },
    },
];

export default config;
