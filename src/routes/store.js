// ============================================================
//
// STORE ROUTER
//
// This router will allow for fetching the following routes
//
// GET all products (/api/episodes/:episodeID)
// GET single product
//
// Router handles:
// --- text search (title, description)
// --- filter by podcasts
// --- filter by categories
// --- sort alphabetical (asc/desc)
// --- sort price (asc/desc)
// --- pagination
//
// ============================================================

const express = require('express');
const router = express.Router();
const { pool } = require('../db.js');

router.get('/', async (req, res) => {
  const { search, podcast, category, sort, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // INITIAL QUERY - What do I want to select and see? - SELECT ==========================================================================================
  let query = `
    SELECT 
        products.product_id,
        products.name,
        products.description,
        products.price,
        products.stock,
        JSON_AGG(DISTINCT product_images.image_url) AS images,
        JSON_AGG(DISTINCT product_images.image_alt_text) AS images_alt_text,
        JSON_AGG(DISTINCT product_categories.name) AS categories,
        JSON_AGG(DISTINCT podcasts_products_join.podcast_id) AS related_podcast_id
    FROM products
    LEFT JOIN product_images ON products.product_id = product_images.product_id
    LEFT JOIN products_categories_join ON products.product_id = products_categories_join.product_id
    LEFT JOIN product_categories ON products_categories_join.category_id = product_categories.category_id
    LEFT JOIN podcasts_products_join ON products.product_id = podcasts_products_join.product_id
  `;

  // FILTERING - What specifically?  - WHERE ==========================================================================================
  const whereModifiers = [];
  const params = [];
  let paramNumber = 1;

  if (search) {
    whereModifiers.push(
      `products.name ILIKE $${paramNumber} OR products.description ILIKE $${paramNumber}`
    );
    params.push(`%${search}%`);
    paramNumber++;
  }

  if (podcast) {
    whereModifiers.push(`podcasts_products_join.podcast_id = $${paramNumber}`);
    params.push(podcast);
    paramNumber++;
  }

  if (category) {
    const categories = Array.isArray(category) ? category : category.split(',');
    whereModifiers.push(`product_categories.name = ANY($${paramNumber})`);
    params.push(categories);
    paramNumber++;
  }

  if (whereModifiers.length > 0) {
    query = query + ` WHERE ` + whereModifiers.join(' AND ');
  }

  // ORGANISING ROWS - How are rows grouped? - GROUP BY ==========================================================================================
  query =
    query +
    ` GROUP BY products.product_id, products.name, products.description, products.price, products.stock`;

  // SORTING - Are sorting rules applied? - SORT BY ==========================================================================================
  const sortOptions = {
    name_ASC: 'products.name ASC',
    name_DESC: 'products.name DESC',
    price_ASC: 'products.price ASC',
    price_DESC: 'products.price DESC',
  };

  if (sort) {
    query = query + ` ORDER BY ${sortOptions[sort]}`;
  } else {
    query = query + ` ORDER BY products.name ASC`;
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

router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT 
            product_categories.category_id,
            product_categories.name,
            product_categories.description
        FROM product_categories
        ORDER BY name ASC
        `
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:productID', async (req, res) => {
  const { productID } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
            products.product_id,
            products.name,
            products.description,
            products.price,
            products.stock,
            JSON_AGG(DISTINCT product_images.image_url) AS images,
            JSON_AGG(DISTINCT product_images.image_alt_text) AS images_alt_text,
            JSON_AGG(DISTINCT product_categories.name) AS categories,
            JSON_AGG(DISTINCT podcasts_products_join.podcast_id) AS related_podcast_id
        FROM products
        LEFT JOIN product_images ON products.product_id = product_images.product_id
        LEFT JOIN products_categories_join ON products.product_id = products_categories_join.product_id
        LEFT JOIN product_categories ON products_categories_join.category_id = product_categories.category_id
        LEFT JOIN podcasts_products_join ON products.product_id = podcasts_products_join.product_id
        WHERE products.product_id = $1
        GROUP BY products.product_id, products.name, products.description, products.price
        `,
      [productID]
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
