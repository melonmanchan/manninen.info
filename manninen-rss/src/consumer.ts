import kafka from "kafka-node";

const kafkaClient = new kafka.KafkaClient();

type Article = {
  link: string;
  text: string;
};

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
    articles.push(article);
  } catch (ex) {
    console.error(ex);
  }
});

consumer.on("error", (err: any) => {
  console.error(err);
  process.exit(-1);
});

export { consumer, articles };
