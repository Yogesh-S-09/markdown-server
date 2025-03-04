import express from "express";
import serverless from "serverless-http";
const app = express();
app.get('/.netlify/functions/api', (req, res) => {
  res.send(`<h1>Markdown Files</h1>`);
});
app.get('/.netlify/functions/Hi', (req, res) => {
  res.send(`<h1>Hi</h1>`);
});
app.get('/', (req, res) => {
  res.send(`<h1>Root</h1>`);
});
export const handler = serverless(app);
