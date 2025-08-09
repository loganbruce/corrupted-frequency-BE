const { pool } = require('../src/db.js');

const unseed = async () => {
  try {
    console.log('unseeding . . .');

    await pool.query(`DELETE FROM products_categories_join;`);
    await pool.query(`DELETE FROM podcasts_products_join;`);
    await pool.query(`DELETE FROM episodes_hosts_join;`);
    await pool.query(`DELETE FROM podcasts_hosts_join;`);
    await pool.query(`DELETE FROM team_members;`);
    await pool.query(`DELETE FROM hosts;`);
    await pool.query(`DELETE FROM staff_picks;`);
    await pool.query(`DELETE FROM product_categories;`);
    await pool.query(`DELETE FROM product_images;`);
    await pool.query(`DELETE FROM products;`);
    await pool.query(`DELETE FROM transcripts;`);
    await pool.query(`DELETE FROM cover_images;`);
    await pool.query(`DELETE FROM episodes;`);
    await pool.query(`DELETE FROM podcasts;`);
    await pool.query(`DELETE FROM genres;`);

    console.log('unseeding complete');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

unseed();

