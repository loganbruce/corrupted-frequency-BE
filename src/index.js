// imports and set up //
const express = require('express');
const dotenv = require('dotenv');
const testRouter = require('./routes/test');
const podcastRouter = require('./routes/podcasts');

dotenv.config();

const app = express();
app.use(express.json());

// routes //
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/test', testRouter);

app.use('/api/podcasts', podcastRouter);

// start server //
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
