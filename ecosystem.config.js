// PM2 — configuração de processo
// Subir:    pm2 start ecosystem.config.js
// Recarregar após deploy:  pm2 reload nortend-site
// Logs:     pm2 logs nortend-site
module.exports = {
  apps: [
    {
      name: 'nortend-site',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
