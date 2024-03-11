export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  openAi: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});
