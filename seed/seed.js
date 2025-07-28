const { pool } = require('../src/db.js');

const seed = async () => {
  try {
    console.log('seeding . . .');

    await pool.query(
      `
        INSERT INTO podcasts (title, description)
        VALUES
            ('TEST Crime Time', 'This is a Corrupted Frequency Podcast'),
            ('TEST Laughing Stock', 'This is a Corrupted Frequency Podcast');
        `
    );
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
    await pool.query(
      `
        INSERT INTO hosts (name, bio, image_url, image_alt_text)
        VALUES
            ('Susan G', 'A podcaster of 5 years. Audio Engineer.', 'https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'Susan Headshot'),
            ('Mark Y', 'A podcaster of 6 years. Audio Engineer.', 'https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'Mark Headshot'),
            ('Thuy T', 'A podcaster of 8 years. Audio Engineer.', 'https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'Thuy Headshot');
        `
    );
    await pool.query(
      `
        INSERT INTO cover_images (image_url, image_alt_text, podcast_id)
        VALUES
            ('https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'Crime Time Cover', 1),
            ('https://corruptedfrequency-storage.s3.ap-southeast-2.amazonaws.com/images/Screenshot+2025-07-27+at+10.07.53+pm.png', 'Laughing Stock Cover', 2);
        `
    );
    await pool.query(
      `
        INSERT INTO episodes (title, description, published, audio_url, duration, episode_number, podcast_id)
        VALUES
            ('Crime 1', 'Uncover the clues with us this week on our newest mystery.', NOW(), 'https://url.com/audio.mp3', 1800, 1, 1),
            ('Crime 2', 'Lets dig into what happened.', NOW(), 'https://url.com/audio.mp3', 1500, 2, 1),
            ('Sunday Morning Giggles with Julian Clary', 'Get your laughs in.', NOW(), 'https://url.com/audio.mp3', 1500, 1, 2),
            ('101 Jokes', 'Jokes to tell your friends.', NOW(), 'https://url.com/audio.mp3', 1500, 2, 2),
            ('102 Jokes', 'Jokes to tell your friends.', NOW(), 'https://url.com/audio.mp3', 1500, 2, 2);
        `
    );
    await pool.query(
      `
        INSERT INTO team_members (name, bio, picture_url, image_alt_text, sort_order)
        VALUES
            ('Chloe Iverson', 'CEO of our wonderful team, she started this company and keeps everyone on track. Chloes favorite podcast genre is True Crime!.', 'https://url.com/image.jpg', 'Chloe headshot', 1),
            ('Amir Sadr', 'Amir is our head of marketing and connections, he is in charge of finding our podcast talent and the community. Amirs favorite podcast genre is fiction!', 'https://url.com/image.jpg', 'Amir image', 2),
            ('Rachael Rowe', 'Rachael is our head of everything to with design, she is a full stack developer and is in charge in making our site not only look beautiful but feel beautiful for users. Rachaels favorite podcast genres include comedy and mystery.', 'https://url.com/image.jpg', 'Rachael image', 3);
        `
    );
    await pool.query(
      `
        INSERT INTO podcasts_genres_join (podcast_id, genre_id) 
        VALUES 
            (1, 1), 
            (2, 2);
      `
    );
    await pool.query(
      `
        INSERT INTO podcasts_hosts_join (podcast_id, host_id)
        VALUES 
            (1, 1),
            (2, 3);
      `
    );
    await pool.query(
      `
        INSERT INTO episodes_hosts_join (episode_id, host_id, role)
        VALUES 
            (1, 1, 'Host'), 
            (1, 2, 'Guest'), 
            (2, 2, 'Host'),
            (3, 2, 'Host'),
            (4, 3, 'Host'),
            (4, 1, 'Guest'),
            (5, 3, 'Host'),
            (5, 1, 'Guest'),
            (5, 2, 'Guest');
      `
    );

    console.log('seeding complete');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

seed();
