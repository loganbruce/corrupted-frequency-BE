// FIXING MISNAMED COLUMN

exports.up = (pgm) => {
  pgm.renameColumn('podcasts_products_join', 'episode_id', 'podcast_id');
};

// TO ROLLBACK ON MIGRATION
exports.down = (pgm) => {
  pgm.renameColumn('podcasts_products_join', 'podcast_id', 'episode_id');
};
