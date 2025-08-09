const { pool } = require('../src/db.js');
const { faker } = require('@faker-js/faker');

//=======================================================
//
// podcasts: title, description, genre
// genres: name, description, genre_image_url, image_alt_text, icon
// hosts: name, bio, image_url, image_alt_text
// cover_images: image_url, image_alt_text, podcast_id
// episodes: title, description, audio_url, duration, episode_number, published
// transcripts: content, episode_id
// team_members: name, bio, picture_url, image_alt_text, sort_order
// products: name, description, price, stock, is_active
// product_images: image_url, image_alt_text, product_id
// product_categories: name, description, icon
// staff_picks: podcast_id, team_id, comment, sort_order
// podcasts_hosts_join: podcast_id, host_id
// episodes_hosts_join: episode_id, host_id, role
// podcasts_products_join: episode_id, product_id
// products_categories_join: category_id, product_id
//
//=======================================================

const seed = async () => {
  try {
    console.log('seeding . . .');

    // ASSIGN SET GENRES
    console.log('seeding genres...');
    await pool.query(
      `
      INSERT INTO genres (name, description, genre_image_url, image_alt_text)
      VALUES
      ('crime', 'Solve chilling mysteries.', 'https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'image depicting genre'),
      ('storytelling', 'Unravel the yarn.', 'https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'image depicting genre'),
      ('fiction', 'Embrace immserive worlds', 'https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'image depicting genre'),
      ('dnd', 'Roll for initiative and fight.', 'https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'image depicting genre'),
      ('fantasy', 'Fairies, goblins, and all things fae.', 'https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'image depicting genre');
      `
    );

    const { rows: genres } = await pool.query(`SELECT genre_id FROM genres`);
    const genreIDs = genres.map((genre) => genre.genre_id);

    // GENERATE RANDOM PODCASTS
    console.log('generating podcasts...');
    for (let i = 0; i < 10; i++) {
      const title = faker.book.title();
      const description = faker.lorem.paragraph();
      const genreID = faker.helpers.arrayElement(genreIDs);

      await pool.query(
        `
        INSERT INTO podcasts (title, description, genre_id)
        VALUES ($1, $2, $3)
        `,
        [title, description, genreID]
      );
    }

    const { rows: podcasts } = await pool.query(
      `SELECT podcast_id FROM podcasts`
    );
    const podcastIDs = podcasts.map((podcast) => podcast.podcast_id);

    // GENERATE RANDOM HOSTS
    console.log('generating hosts...');
    for (let i = 0; i < 10; i++) {
      const name = faker.person.fullName();
      const bio = faker.lorem.paragraph();
      const hostImageURL = faker.image.avatar();
      const hostImageALT = `headshot of ${name}`;

      await pool.query(
        `
        INSERT INTO hosts (name, bio, image_url, image_alt_text)
        VALUES ($1, $2, $3, $4)
        `,
        [name, bio, hostImageURL, hostImageALT]
      );
    }

    const { rows: hosts } = await pool.query(
      `SELECT host_id FROM hosts`
    );
    const hostIDs = hosts.map((host) => host.host_id);

    // GENERATE RANDOM COVER_IMAGES
    console.log('generating cover images...');
      for (const podcastID of podcastIDs) {
        const coverImageURL = faker.image.url();
        const coverImageALT = faker.lorem.lines(1);
        
        await pool.query(
          `    
          INSERT INTO cover_images (image_url, image_alt_text, podcast_id)
          VALUES ($1, $2, $3)
          `,
          [coverImageURL, coverImageALT, podcastID]
        );
      }

    // GENERATE RANDOM EPISODES
    console.log('generating episodes...');
    for (let i = 0; i < podcastIDs.length; i++) {
      const podcastID = podcastIDs[i];
      const episodeQuantity = faker.number.int({ min: 3, max: 10 });

      for (let episodeNumber = 1; episodeNumber <= episodeQuantity; episodeNumber++) {
        const episodeTitle = faker.lorem.sentence();
        const episodeDescription = faker.lorem.paragraph();
        const audio_url = faker.image.url();
        const duration = faker.number.int({ min: 45, max: 120 });
        const published = faker.date.past();
        await pool.query(
          `
          INSERT INTO episodes (title, description, audio_url, duration, episode_number, published, podcast_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [episodeTitle, episodeDescription, audio_url, duration, episodeNumber, published, podcastID]
        );
      }
    }

    const { rows: episodes } = await pool.query(
      `SELECT episode_id FROM episodes`
    );
    const episodeIDs = episodes.map((episode) => episode.episode_id);

    // GENERATE RANDOM TRANSCRIPTS
    console.log('generating transcripts...');
    for (let i = 0; i < episodeIDs.length; i++) {
      const content = faker.lorem.paragraphs({min: 2, max: 5});
      const episodeID = episodeIDs[i];

      await pool.query(
        `
        INSERT INTO transcripts (content, episode_id)
        VALUES ($1, $2)
        `,
        [content, episodeID]
      );
    }

    // GENERATE RANDOM RATINGS
    console.log('generating ratings...');
    for (const podcastID of podcastIDs) {
      const ratingsQuantity = faker.number.int({min: 0, max: 5});

      for (let ratingNumber = 0; ratingNumber <= ratingsQuantity; ratingNumber++) {
        const anonID = faker.string.uuid();
        const rating = faker.number.int({min: 0, max: 5});
        const ip = faker.internet.ipv4();
        
        await pool.query(
          `
          INSERT INTO ratings (podcast_id, anon_id, rating, ip)
          VALUES ($1, $2, $3, $4)
          `,
          [podcastID, anonID, rating, ip]
        );
      }
    }
      
    // GENERATE RANDOM TEAM MEMBERS
    console.log('generating team members...');
    for (let i = 0; i < 3; i++) {
      const name = faker.person.fullName();
      const bio = faker.lorem.paragraph();
      const pictureURL = faker.image.avatar()
      const pictureALT = ` headshot of ${name}`
      const sortOrder = i + 1
      
      await pool.query(
        `
        INSERT INTO team_members (name, bio, picture_url, image_alt_text, sort_order)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [name, bio, pictureURL, pictureALT, sortOrder]
      );
    }

    const { rows: teamMembers } = await pool.query(
      `SELECT team_id FROM team_members`
    );
    const teamMemberIDs = teamMembers.map((teamMember) => teamMember.team_id);

    // GENERATE RANDOM PRODUCTS
    console.log('generating products...');
    for (let i = 0; i < 10; i++) {
      const name = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const price = faker.number.int({min: 30, max: 120});
      const stock = faker.number.int({min: 0, max: 120});
      const isActive = faker.helpers.arrayElement([true, false]);
      
      await pool.query(
        `
        INSERT INTO products (name, description, price, stock, is_active)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [name, description, price, stock, isActive]
      );
    }

    const { rows: products } = await pool.query(
      `SELECT product_id, name FROM products`
    );

    // GENERATE RANDOM PRODUCT IMAGES
    console.log('generating product images..');
    for (const product of products)  {
      const imageQuantity = faker.number.int({min: 1, max: 4});

      for (let imageNumber = 1; imageNumber <= imageQuantity; imageNumber++) { 
        const imageURL = faker.image.url();
        const imageALT = `Product image ${imageNumber} for ${product.name}`;

        await pool.query(
          `
          INSERT INTO product_images (image_url, image_alt_text, product_id)
          VALUES ($1, $2, $3)
          `, 
          [imageURL, imageALT, product.product_id]
        )
      }
    }

    // ASSIGN PRODUCT CATEGORIES
    console.log('seeding product categories...');
    await pool.query(
      `
      INSERT INTO product_categories (name, description, icon)
      VALUES
      ('Clothing', 'Express yourself with amazing quality outfits from your favourite podcast.','shirt'),
      ('Downloads', 'Downloadable content and files.','download'),
      ('Limited Edition', 'Limited supplies, get them while you can!.','trophy'),
      ('New Arrivals', 'Fresh in the store.','package'),
      ('Stationery', 'Be inspired to create your own worlds.','notebook'),
      ('Accessories', 'Customise your world with accesories from your favourite podcasts.','watch');
      `
    );

    const { rows: categories } = await pool.query(`SELECT category_id FROM product_categories`);
    const categoryIDs = categories.map((category) => category.category_id);

    // ASSIGN RANDOM STAFF PICKS
    // Unsure about this one, needs testing
    console.log('assigning random staff picks ...');
    for (const teamMemberID of teamMemberIDs) { 
      const podcastID = podcastIDs[Math.floor(Math.random() * podcastIDs.length)];
      const comment = faker.lorem.lines(2);
      const sortOrder = Math.floor(Math.random()*teamMemberIDs.length + 1 )
      await pool.query(
        `
        INSERT INTO staff_picks (podcast_id, team_id, comment, sort_order)
        VALUES ($1, $2, $3, $4)
        `,
        [podcastID, teamMemberID, comment, sortOrder]
      )
    }

    // ASSIGN HOSTS TO PODCASTS
    console.log('assigning hosts to podcasts...');
    for (const podcastID of podcastIDs) { 
      const hostQuantity = faker.number.int({ min: 1, max: 3 });
      const hosts = faker.helpers.shuffle(hostIDs).slice(0, hostQuantity);

      for (const hostID of hosts) {
        await pool.query(
          `
          INSERT INTO podcasts_hosts_join (podcast_id, host_id)
          VALUES ($1, $2)
          `,
          [podcastID, hostID]
        )
      }
    }
    
    // ASSIGN PODCASTS TO PRODUCTS
    console.log('assigning podcasts to products...');
    for (const podcastID of podcastIDs) {
      const productQuantity = faker.number.int({ min: 1, max: 3})
      const productList = faker.helpers.shuffle(products).slice(0, productQuantity)
      for (let i = 0; i < productList.length; i++) { 
        const product = productList[i]
        await pool.query(
          `
          INSERT INTO podcasts_products_join (podcast_id, product_id)
          VALUES ($1, $2)
          `,
          [podcastID, product.product_id]
        )
      }
    }

    // ASSIGN CATEGORIES TO PRODUCTS
    console.log('assigning categories to products...');
    for (const product of products) {
      const categoryQuantity = faker.number.int({ min: 1, max: 2})
      const categories = faker.helpers.shuffle(categoryIDs).slice(0, categoryQuantity)
      for (let i = 0; i < categories.length; i++) { 
        const categoryID = categories[i]
        await pool.query(
          `
          INSERT INTO products_categories_join (category_id, product_id)
          VALUES ($1, $2)
          `,
          [categoryID, product.product_id]
        )
      }
    }
    
    console.log('seeding complete');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

seed();
