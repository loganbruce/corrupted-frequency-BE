// imports and set up //
const express = require('express');
const dotenv = require('dotenv');
const podcastRouter = require('./routes/podcasts');
const episodesRouter = require('./routes/episodes');
const storeRouter = require('./routes/store');
const teamRouter = require('./routes/team');
const genreRouter = require('./routes/genres');

dotenv.config();

const app = express();
app.use(express.json());

// routes //

// home
app.get('/', (req, res) => {
  res.send('API is running');
});

// podcasts
app.use('/api/podcasts', podcastRouter);

// genres
app.use('/api/genres', genreRouter);

// // episodes
app.use('/api/episodes', episodesRouter);

// // store
app.use('/api/store', storeRouter);

// // team
app.use('/api/team', teamRouter);

// start server //
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
