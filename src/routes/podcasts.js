// ============================================================
//
// PODCASTS ROUTER
//
// This router will allow for fetching the following routes
//
// GET all podcasts (/api/podcasts)
// GET random podcast (/api/podcasts/random)
// GET episodes by podcasts (/api/podcasts/:podcastID/episodes)
//
// Router handles:
// --- text search (title, description)
// --- genre filter
// --- sort by rating (asc / desc)
// --- sort by date (asc/desc)
// --- sort alphabetical (asc/desc)
// --- pagination
//
// ============================================================

const express = require('express');
const router = express.Router();
const { pool } = require('../db.js');

router.get('/random', async (req, res) => {
  const { genre } = req.query;

  if (!genre) {
    res.send('No genre provided. Please provide a genre');
    return res.status(400).json({ error: 'Genre required.' });
  } else {
    try {
      const result = await pool.query(
        `
        SELECT podcasts.*
        FROM podcasts
        LEFT JOIN genres ON podcasts.genre_id = genres.genre_id
        WHERE genres.name = $1
        ORDER BY RANDOM() * RANDOM()
        LIMIT 1;
        `,
        [genre]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  }
});

router.get('/', async (req, res) => {
  const { search, genre, sort, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // INITIAL QUERY - What do I want to select and see? - SELECT ==========================================================================================
  let query = `
    SELECT
      podcasts.podcast_id,
      podcasts.title,
      podcasts.description,
      cover_images.image_url AS cover_image_url,
      cover_images.image_alt_text AS cover_image_alt_text,
      COUNT(episodes.episode_id) AS episode_count,
      JSON_AGG(DISTINCT hosts.name) AS hosts,
      genres.name AS genre_name,
      AVG(ratings.rating) AS average_rating
    FROM podcasts
    LEFT JOIN episodes ON podcasts.podcast_id = episodes.podcast_id
    LEFT JOIN podcasts_hosts_join ON podcasts.podcast_id = podcasts_hosts_join.podcast_id
    LEFT JOIN hosts ON podcasts_hosts_join.host_id = hosts.host_id
    LEFT JOIN cover_images ON podcasts.podcast_id = cover_images.podcast_id
    LEFT JOIN genres ON podcasts.genre_id = genres.genre_id
    LEFT JOIN ratings ON podcasts.podcast_id = ratings.podcast_id
  `;

  // FILTERING - What specifically?  - WHERE ==========================================================================================
  const whereModifiers = [];
  const params = [];
  let paramNumber = 1;

  if (search) {
    whereModifiers.push(
      `podcast.title ILIKE $${paramNumber} OR podcasts.description ILIKE $${paramNumber}`
    );
    params.push(`%${search}%`);
    paramNumber++;
  }

  if (genre) {
    whereModifiers.push(`genres.name = $${paramNumber}`);
    params.push(genre);
    paramNumber++;
  }

  if (whereModifiers.length > 0) {
    query = query + ` WHERE ` + whereModifiers.join(' AND ');
  }

  // ORGANISING ROWS - How are rows grouped? - GROUP BY ==========================================================================================
  query =
    query +
    ` GROUP BY podcasts.podcast_id, podcasts.title, podcasts.description, cover_images.image_url, cover_images.image_alt_text, genres.name`;

  // SORTING - Are sorting rules applied? - SORT BY ==========================================================================================
  const sortOptions = {
    rating_ASC: 'podcasts.rating ASC',
    rating_DESC: 'podcasts.rating DESC',
    title_ASC: 'podcasts.title ASC',
    title_DESC: 'podcasts.title DESC',
  };

  if (sort) {
    query = query + ` ORDER BY ${sortOptions[sort]}`;
  } else {
    query = query + ` ORDER BY podcasts.podcast_id`;
  }

  query = query + ` LIMIT $${paramNumber} OFFSET $${paramNumber + 1}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:podcastID', async (req, res) => {
  const { podcastID } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          podcasts.podcast_id,
          podcasts.title,
          podcasts.description,
          cover_images.image_url AS cover_image_url,
          cover_images.image_alt_text AS cover_image_alt_text,
          COUNT(episodes.episode_id) AS episode_count,
          JSON_AGG(DISTINCT hosts.name) AS hosts,
          genres.name AS genre_name,
          AVG(ratings.rating) AS average_rating
        FROM podcasts
        LEFT JOIN episodes ON podcasts.podcast_id = episodes.podcast_id
        LEFT JOIN podcasts_hosts_join ON podcasts.podcast_id = podcasts_hosts_join.podcast_id
        LEFT JOIN hosts ON podcasts_hosts_join.host_id = hosts.host_id
        LEFT JOIN cover_images ON podcasts.podcast_id = cover_images.podcast_id
        LEFT JOIN genres ON podcasts.genre_id = genres.genre_id
        LEFT JOIN ratings ON podcasts.podcast_id = ratings.podcast_id
        WHERE podcasts.podcast_id = $1
        GROUP BY podcasts.podcast_id, podcasts.title, podcasts.description, cover_images.image_url, cover_images.image_alt_text, genres.name
        `,
      [podcastID]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:podcastID/episodes', async (req, res) => {
  const { podcastID } = req.params;
  let { sort = 'episode_number_DESC', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const sortOptions = {
    episode_number_DESC: 'episodes.episode_number DESC',
    episode_number_ASC: 'episode.episode_number ASC',
  };

  let query = `
    SELECT 
    episodes.episode_id,
    episodes.episode_number,
    episodes.title,
    episodes.description,
    episodes.published,
    episodes.audio_url,
    episodes.duration
    FROM episodes
    WHERE episodes.podcast_id = $1
    ORDER BY ${sortOptions[sort]}
    LIMIT $2 OFFSET $3
    `;

  try {
    const result = await pool.query(query, [podcastID, limit, offset]);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
