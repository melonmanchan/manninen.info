import { articlesToFeed } from "./feed";
import { articles } from "./consumer";

import express from "express";

const app = express();
const port = 3000;

app.get("/rss.xml", (req, res) => {
  res.contentType("application/rss+xml");
  res.send(articlesToFeed(articles));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
