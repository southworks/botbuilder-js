module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'only-warn'
    ],
    extends: [        
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint'
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            impliedStrict: true
        },
    },
    rules: {               
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-object-literal-type-assertion': 'off',                        
        'eqeqeq': ["error", "smart"],        
        'radix': 'error',                
        'no-var': "error",        
        "one-var": ["error", { var: "never", let: "never", const: "never" }],               
        'curly': ["error", "all"],           
        "spaced-comment": ["warn", "always"],
    },
}; 
