// INITIAL DB MIGRATION

// Setting up all planned tables
// - podcasts
// - genres
// - episodes
// - transcripts
// - hosts
// - cover images
// - staff picks
// - products
// - product images
// - and all relevant join tables to cross-reference tables

exports.up = (pgm) => {
  // ===================================== PODCASTS
  pgm.createTable('podcasts', {
    podcast_id: {
      type: 'serial',
      primaryKey: true,
    },
    title: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });

  // ===================================== GENRES
  pgm.createTable('genres', {
    genre_id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    genre_image_url: {
      type: 'text',
    },
    image_alt_text: {
      type: 'text',
    },
    icon: {
      type: 'text',
    },
  });

  // ===================================== HOSTS
  pgm.createTable('hosts', {
    host_id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
    bio: {
      type: 'text',
      notNull: true,
    },
    image_url: {
      type: 'text',
    },
    image_alt_text: {
      type: 'text',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });

  // ===================================== COVER IMAGES
  pgm.createTable('cover_images', {
    cover_id: {
      type: 'serial',
      primaryKey: true,
    },
    image_url: {
      type: 'text',
      noNull: 'true',
    },
    image_alt_text: {
      type: 'text',
      notNull: true,
    },
    podcast_id: {
      type: 'int',
      references: 'podcasts(podcast_id)',
      onDelete: 'cascade',
      unique: true,
    },
  });

  // ===================================== EPISODES
  pgm.createTable('episodes', {
    episode_id: {
      type: 'serial',
      primaryKey: true,
    },
    title: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    published: {
      type: 'timestamptz',
      notNull: true,
    },
    audio_url: {
      type: 'text',
      notNull: true,
    },
    duration: {
      type: 'int',
      notNull: true,
    },
    episode_number: {
      type: 'int',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    podcast_id: {
      type: 'int',
      references: 'podcasts(podcast_id)',
      onDelete: 'cascade',
    },
  });

  // ===================================== TRANSCRIPTS
  pgm.createTable('transcripts', {
    transcript_id: {
      type: 'serial',
      primaryKey: true,
    },
    content: {
      type: 'text',
      noNull: 'true',
      unique: true,
    },
    episode_id: {
      type: 'int',
      references: 'episodes(episode_id)',
      onDelete: 'cascade',
    },
  });

  // ===================================== TEAM MEMBERS
  pgm.createTable('team_members', {
    team_id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'text',
      noNull: 'true',
    },
    bio: {
      type: 'text',
      noNull: 'true',
    },
    picture_url: {
      type: 'text',
      notNull: false,
    },
    image_alt_text: {
      type: 'text',
      notNull: false,
    },
    sort_order: {
      type: 'int',
      notNull: true,
    },
  });

  // ===================================== STAFF PICKS (PODCAST JOIN)
  pgm.createTable('staff_picks', {
    podcast_id: {
      type: 'int',
      references: 'podcasts(podcast_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
    team_id: {
      type: 'int',
      references: 'team_members(team_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
    comment: {
      type: 'text',
      notNull: false,
    },
    sort_order: {
      type: 'int',
      notNull: true,
    },
  });

  // ===================================== PRODUCTS
  pgm.createTable('products', {
    product_id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'text',
      noNull: 'true',
    },
    description: {
      type: 'text',
      noNull: 'true',
    },
    price: {
      type: 'int',
      noNull: 'true',
    },
    stock: {
      type: 'int',
      noNull: 'true',
    },
    is_active: {
      type: 'boolean',
      default: true,
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });

  // ===================================== PRODUCT IMAGES
  pgm.createTable('product_images', {
    image_id: {
      type: 'serial',
      primaryKey: true,
    },
    image_url: {
      type: 'text',
      noNull: 'true',
    },
    image_alt_text: {
      type: 'text',
      noNull: 'true',
    },
    product_id: {
      type: 'int',
      references: 'products(product_id)',
      onDelete: 'cascade',
    },
  });

  // ===================================== PRODUCT CATEGORIES
  pgm.createTable('product_categories', {
    category_id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'text',
      noNull: 'true',
    },
    description: {
      type: 'text',
      noNull: 'true',
    },
    icon: {
      type: 'text',
      noNull: 'true',
    },
  });

  // ===================================== PODCASTS GENRES JOIN
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

  // ===================================== PODCASTS HOSTS JOIN
  pgm.createTable('podcasts_hosts_join', {
    podcast_id: {
      type: 'int',
      references: 'podcasts(podcast_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
    host_id: {
      type: 'int',
      references: 'hosts(host_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
  });

  // ===================================== EPISODES HOSTS JOIN
  pgm.createTable('episodes_hosts_join', {
    episode_id: {
      type: 'int',
      references: 'episodes(episode_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
    host_id: {
      type: 'int',
      references: 'hosts(host_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
    role: {
      type: 'text',
      notNull: false,
    },
  });

  // ===================================== PODCASTS PRODUCTS JOIN
  pgm.createTable('podcasts_products_join', {
    episode_id: {
      type: 'int',
      references: 'podcasts(podcast_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
    product_id: {
      type: 'int',
      references: 'products(product_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
  });

  // ===================================== PRODUCTS CATEGORIES JOIN
  pgm.createTable('products_categories_join', {
    category_id: {
      type: 'int',
      references: 'product_categories(category_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
    product_id: {
      type: 'int',
      references: 'products(product_id)',
      onDelete: 'cascade',
      primaryKey: true,
    },
  });
};

// TO ROLLBACK ON MIGRATION
exports.down = (pgm) => {
  pgm.dropTable('products_categories_join');
  pgm.dropTable('podcasts_products_join');
  pgm.dropTable('episodes_hosts_join');
  pgm.dropTable('podcasts_hosts_join');
  pgm.dropTable('podcasts_genres_join');
  pgm.dropTable('product_categories');
  pgm.dropTable('product_images');
  pgm.dropTable('products');
  pgm.dropTable('staff_picks');
  pgm.dropTable('team_members');
  pgm.dropTable('transcripts');
  pgm.dropTable('episodes');
  pgm.dropTable('cover_images');
  pgm.dropTable('hosts');
  pgm.dropTable('genres');
  pgm.dropTable('podcasts');
};
