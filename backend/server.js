const dotEnv = require('dotenv');

dotEnv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
