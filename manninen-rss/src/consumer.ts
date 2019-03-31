import { Article } from "./types";
import kafka from "kafka-node";

const kafkaClient = new kafka.KafkaClient();

const articles: Array<Article> = [];

// Use date here to always get latest data for debuggingt
const consumer = new kafka.Consumer(kafkaClient, [{ topic: "manninen" }], {
  groupId: "manninen-rss" + new Date().getTime()
});

const messageAsJson = (msg: String | Buffer): string => {
  return msg.toString();
};

consumer.on("message", msg => {
  console.log(msg);
  try {
    const article = JSON.parse(messageAsJson(msg.value)) as Article;
    articles.push({ ...article, ...{ date: new Date() } });
  } catch (ex) {
    console.error(ex);
  }
});

consumer.on("error", (err: any) => {
  console.error(err);
  process.exit(-1);
});

export { articles };
