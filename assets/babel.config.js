module.exports = {
  presets: [
    // "@babel/preset-react"
    'react-app'
  ],
  plugins: [
    // '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-partial-application',
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'fsharp' }]
  ]
};
