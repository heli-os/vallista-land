const TOKEN = process.argv[2] || null

const ghpages = require('gh-pages')

ghpages.publish(
  'public',
  {
    branch: 'main',
    repo: TOKEN
      ? `https://heli-os:${TOKEN}@github.com/heli-os/heli-os.github.io.git`
      : 'https://github.com/heli-os/heli-os.github.io.git',
    silent: true
  },
  function (err) {
    if (err) {
      const sanitized = err.message ? err.message.replace(TOKEN || '', '***') : err
      console.error('Deploy failed:', sanitized)
      process.exit(1)
    }
    console.log('Deploy completed successfully.')
  }
)
