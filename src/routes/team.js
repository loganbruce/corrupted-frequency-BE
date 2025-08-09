// ============================================================
//
// TEAM ROUTER
//
// This router will allow for fetching the following routes
//
// GET all team members (/api/team)
// GET all team member recommendations (/api/team/recommendations)
//
// No need for filtering ot sorting options
//
// ============================================================

const express = require('express');
const router = express.Router();
const { pool } = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT team_members.*
        FROM team_members
        ORDER BY team_members.sort_order ASC
        `
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/staff-picks', async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
            team_members.name AS team_member_name,
            staff_picks.podcast_id,
            podcasts.title AS podcast_title,
            podcasts.description,
            cover_images.image_url AS cover_image_url,
            cover_images.image_alt_text AS cover_image_alt_text,
            COUNT(episodes.episode_id) AS episode_count,
            JSON_AGG(DISTINCT hosts.name) AS hosts,
            genres.name AS genre_name,
            AVG(ratings.rating) AS average_rating,
            staff_picks.comment
        FROM staff_picks
        JOIN podcasts on staff_picks.podcast_id = podcasts.podcast_id
        JOIN team_members on staff_picks.team_id = team_members.team_id
        LEFT JOIN episodes ON podcasts.podcast_id = episodes.podcast_id
        LEFT JOIN podcasts_hosts_join ON podcasts.podcast_id = podcasts_hosts_join.podcast_id
        LEFT JOIN hosts ON podcasts_hosts_join.host_id = hosts.host_id
        LEFT JOIN cover_images ON podcasts.podcast_id = cover_images.podcast_id
        LEFT JOIN genres ON podcasts.genre_id = genres.genre_id
        LEFT JOIN ratings ON podcasts.podcast_id = ratings.podcast_id
        GROUP BY podcasts.podcast_id, podcasts.title, podcasts.description, cover_images.image_url, cover_images.image_alt_text, genres.name, team_members.name, staff_picks.podcast_id, staff_picks.podcast_id, staff_picks.comment, staff_picks.sort_order
        ORDER BY staff_picks.sort_order ASC
        
        `
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
