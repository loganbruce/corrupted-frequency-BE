// RATINGS AND GENRES ADJUSTMENT

// Adding new ratngs table
// Droppng podcasts_genres_join and moving to a one to many relationship

exports.up = (pgm) => {
  pgm.dropTable('podcasts_genres_join');

  pgm.createTable('ratings', {
    rating_id: {
      type: 'serial',
      primaryKey: true,
    },
    podcast_id: {
      type: 'int',
      references: 'podcasts(podcast_id)',
      notNull: true,
      onDelete: 'cascade',
    },
    anon_id: {
      type: 'text',
      notNull: 'true',
    },
    rating: {
      type: 'int',
      notNull: true,
    },
    ip: {
      type: 'text',
      notNull: 'false',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('ratings', 'unique_id_per_podcast_rating', {
    unique: ['podcast_id', 'anon_id'],
  });

  pgm.addColumns('podcasts', {
    genre_id: {
      type: 'int',
      references: 'genres(genre_id)',
      notNull: true,
      onDelete: 'restrict',
    },
  });
};

// TO ROLLBACK ON MIGRATION
exports.down = (pgm) => {
  pgm.dropColumns('podcasts, genre_id');
  pgm.dropTable('ratings');
  pgm.createTable('podcasts_genres_join', {
    podcast_id: {
      type: 'int',
      references: 'podcasts(podcast_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
    genre_id: {
      type: 'int',
      references: 'genres(genre_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
  });
};
