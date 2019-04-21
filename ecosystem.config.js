module.exports = {
  apps : [{
    name: 'siret-invader',
    script: './source/step-2/pm2-entry.js',
    instances: 1,
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'dev'
    },
    error_file: './pm2-logs/pm2-error.log',
    out_file: './pm2-logs/pm2.log'
  }]
}
