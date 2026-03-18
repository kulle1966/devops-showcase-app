const express = require('express');
const cors = require('cors');
const usersRouter = require('./api/users');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/users', usersRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
