import createServer from './Infrastructures/http/createServer.js';
import container from './Infrastructures/container.js';
import config from './Commons/config.js';

const start = async () => {
  const server = await createServer(container);
  const PORT = config.app.port || 5000;

  server.listen(PORT, () => {
    console.log(`Server Forum API sedang berjalan di port ${PORT}`);
    console.log(`Dokumentasi tersedia di http://localhost:${PORT}/api-docs`);
  });
};

start();