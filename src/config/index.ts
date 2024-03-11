export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  openAi: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  image: {
    directory: process.env.IMAGE_DIRECTORY,
    ext: process.env.IMAGE_EXT,
  },
});
