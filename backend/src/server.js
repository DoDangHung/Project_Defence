import app from './app.js';
import dotnev from 'dotenv';

dotnev.config();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost: ${PORT}`);
});
