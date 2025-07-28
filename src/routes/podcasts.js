const express = require('express');
const router = express.Router();
const { pool } = require('../db.js');

// ===================================== ALL PODCASTS
// returned data:
// podcast_id
// title
// description
// created_at
//
// episode count
//
// host name
//
// cover image url
// cover image alt text

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        podcasts.*,
        COUNT(episodes.episode_id) AS episode_count,
        JSON_AGG(DISTINCT hosts.name) AS hosts,
        cover_images.image_url AS cover_image_url,
        cover_images.image_alt_text AS cover_image_alt_text
      FROM podcasts
      LEFT JOIN episodes ON podcasts.podcast_id = episodes.podcast_id
      LEFT JOIN podcasts_hosts_join ON podcasts.podcast_id = podcasts_hosts_join.podcast_id
      LEFT JOIN hosts ON podcasts_hosts_join.host_id = hosts.host_id
      LEFT JOIN cover_images ON podcasts.podcast_id = cover_images.podcast_id
      GROUP BY podcasts.podcast_id, cover_images.image_url, cover_images.image_alt_text
      ORDER BY podcasts.podcast_id;
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// ===================================== PODCAST EPISODES LIST
// returned data:
// episode_id
// title
// published
// audio_url
// duration
// episode_number
//
// hosts
// hosts roles

router.get('/:podcastID/episodes', async (req, res) => {
  try {
    const { podcastID } = req.params;

    const { rows: episodes } = await pool.query(
      `
      SELECT
        episodes.episode_id,
        episodes.title,
        episodes.published, 
        episodes.audio_url, 
        episodes.duration, 
        episodes.episode_number, 
        JSON_AGG(
          jsonb_build_object(
          'host_id', hosts.host_id,
          'name', hosts.name,
          'role', episodes_hosts_join.role
        )
      ) AS hosts  
      FROM episodes
      LEFT JOIN episodes_hosts_join ON episodes_hosts_join.episode_id = episodes.episode_id
      LEFT JOIN hosts ON hosts.host_id = episodes_hosts_join.host_id
      WHERE episodes.podcast_id = $1
      GROUP BY episodes.episode_id
      ORDER BY episodes.episode_number;
      `,
      [podcastID]
    );

    res.json(episodes);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// ===================================== PODCASTS BY GENRES
// ===================================== GENRES
// ===================================== GET ONE EPISODE

module.exports = router;
