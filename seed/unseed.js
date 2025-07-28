const { pool } = require('../src/db.js');

const unseed = async () => {
  try {
    console.log('unseeding . . .');

    await pool.query(`DELETE FROM episodes_hosts_join;`);
    await pool.query(`DELETE FROM podcasts_genres_join;`);
    await pool.query(`DELETE FROM podcasts_hosts_join;`);
    await pool.query(`DELETE FROM team_members;`);
    await pool.query(`DELETE FROM hosts;`);
    await pool.query(`DELETE FROM cover_images;`);
    await pool.query(`DELETE FROM episodes;`);
    await pool.query(`DELETE FROM genres;`);
    await pool.query(`DELETE FROM podcasts;`);

    console.log('unseeding complete');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

unseed();
