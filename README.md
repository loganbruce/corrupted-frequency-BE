## To launch the project

1. Install Docker
2. Ensure you have node installed
3. Rename .env.example to .env
4. Run `docker compose up --build`
5. Run `npm run migrate`
6. Run `npm run seed`
7. Navigate to http://localhost:3000
8. To close run `docker compose down`

### Available routes:

- http://localhost:3000/podcasts
- http://localhost:3000/podcasts/:podcastID/episodes (replace podcastID with 1 or 2)
