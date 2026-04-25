import createServer from './Infrastructures/http/createServer.js';
import container from './Infrastructures/container.js';
import config from './Commons/config.js';

const start = async () => {
  try {
    const server = await createServer(container);
    const PORT = config.app.port || 5000;

    const listener = server.listen(PORT, () => {
      console.log(`Server Forum API sedang berjalan di port ${PORT}`);
      console.log(`Dokumentasi tersedia di http://localhost:${PORT}/api-docs`);
    });

    // Menjaga agar proses tidak langsung keluar
    process.on('SIGINT', () => {
      listener.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();