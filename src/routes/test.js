const express = require('express');
const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const result = await pool.query(

//         )
//     }
// })

router.get('/', (req, res) => {
  res.send('test route');
});

module.exports = router;
