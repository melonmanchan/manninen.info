import RSS from "rss";

import { Article } from "./types";

export const articlesToFeed = (articles: Array<Article>): string => {
  var feed = new RSS({
    title: "Tuomas manninen articles",
    description: "Latest articles by Tuomas Manninen",
    feed_url: "http://localhost:3000/rss.xml",
    site_url: "http://localhost",
    webMaster: "matti.jokitulppo@gmail.com",
    language: "fi"
  });

  articles.forEach(a => {
    feed.item({
      title: "Tuomas manninen",
      url: a.link,
      description: a.text,
      author: "Tuomas Manninen",
      date: a.date
    });
  });

  const xml = feed.xml({ indent: true });

  return feed.xml();
};
