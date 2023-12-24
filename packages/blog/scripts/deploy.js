const TOKEN = process.argv[2] || null

const ghpages = require('gh-pages')

ghpages.publish(
  'public',
  {
    branch: 'main',
    repo: TOKEN
      ? `https://heli-os:${TOKEN}@github.com/heli-os/heli-os.github.io.git`
      : 'https://github.com/heli-os/heli-os.github.io.git'
  },
  function (err) {
    console.log(err)
  }
)
