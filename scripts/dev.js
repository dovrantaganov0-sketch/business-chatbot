const { spawn } = require('child_process')

const server = spawn('npm', ['--prefix', 'server', 'run', 'dev'], { stdio: 'inherit' })
const client = spawn('npm', ['--prefix', 'client', 'run', 'dev'], { stdio: 'inherit' })

function shutdown() {
  server.kill('SIGTERM')
  client.kill('SIGTERM')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
