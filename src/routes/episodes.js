// ============================================================
//
// EPISODES ROUTER
//
// This router will allow for fetching the following routes
//
// GET one episode (/api/episodes/:episodeID)
// GET transcript by epiosde (/api/episodes/:episdoeID/transcript)
// GET newest episodes (/api/episodes/newest)
//
// ============================================================

const express = require('express');
const router = express.Router();
const { pool } = require('../db.js');

router.get('/newest', async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT episodes.*
        FROM episodes
        ORDER BY episodes.published DESC
        LIMIT 6;
        `
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:episodeID', async (req, res) => {
  const { episodeID } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT episodes.*
        FROM episodes
        WHERE episodes.episode_id = $1
        LIMIT 1;
        `,
      [episodeID]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:episodeID/transcript', async (req, res) => {
  const { episodeID } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT
            episodes.episode_id,
            episodes.title,
            transcripts.content AS transcript
        FROM episodes
        LEFT JOIN transcripts
            ON episodes.episode_id = transcripts.episode_id
        WHERE episodes.episode_id = $1
        LIMIT 1;
        `,
      [episodeID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
