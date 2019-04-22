module.exports = {
  apps : [{
    name: 'siret-invader',
    script: './source/step-2/pm2-entry.js',
    instances: 4,
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',
    error_file: './pm2-logs/pm2-error.log',
    out_file: './pm2-logs/pm2.log'
  }]
}
