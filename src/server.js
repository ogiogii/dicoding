import app from './app.js';
import config from './Commons/config.js';

const PORT = config.app.port || 5000;

app.listen(PORT, () => {
  console.log(`Server Forum API sedang berjalan di port ${PORT}`);
  console.log(`Dokumentasi tersedia di http://localhost:${PORT}/api-docs`);
});