import express from "express";
import serverless from "serverless-http";
const app = express();
app.get('/', (req, res) => {
  res.send(`<h1>Markdown Files</h1>`);
});

export const handler = serverless(app);