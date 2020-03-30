module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 'off',
    camelcase: [
      'error',
      {
        allow: [
          'avatar_id',
          'canceled_at',
          'deliveryman_id',
          'end_date',
          'order_managements_id',
          'signature_id',
          'start_date',
        ],
      },
    ],
  },
};
