// ============================================================
//
// GENRE ROUTER
//
// This router will allow for fetching the following routes
//
// GET all genres (/api/genres/)
//
// ============================================================

const express = require('express');
const router = express.Router();
const { pool } = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT 
            genres.genre_id,
            genres.name,
            genres.description,
            genres.genre_image_url,
            genres.image_alt_text
        FROM genres
        ORDER BY name ASC
        `
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
