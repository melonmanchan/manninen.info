import fetch from "node-fetch";
import cheerio from "cheerio";
import kafka from "kafka-node";
import redis from "redis";

const ILTALEHTI_URL = "https://www.is.fi/haku/?query=Tuomas%20Manninen";

const redisClient = redis.createClient();
const kafkaClient = new kafka.KafkaClient();
const producer = new kafka.Producer(kafkaClient);

producer.on("ready", () => setInterval(main, 5000));

producer.on("error", (err: any) => {
  console.error(err);
  process.exit(-1);
});

const existsAsync = (key: string) =>
  new Promise((resolve, reject) => {
    redisClient.exists(key, (err, exists) =>
      err ? reject(err) : resolve(!!exists)
    );
  });

const setAsync = (key: string, value: any) =>
  new Promise((resolve, reject) => {
    redisClient.set(key, value, (err, response) =>
      err ? reject(err) : resolve(response)
    );
  });

async function main() {
  const page = await fetch(ILTALEHTI_URL);
  const text = await page.text();
  const $ = cheerio.load(text);

  const links = $(".search-result > .block-link")
    .map(function(_index, element) {
      return `https://www.is.fi${$(element).attr("href")}`;
    })
    .get();

  const titles = $(".search-result .title")
    .map(function(_index, element) {
      return $(element).text();
    })
    .get();

  const posts = links.map((l, i) => {
    return {
      link: l,
      text: titles[i]
    };
  });

  const published = await Promise.all(
    posts.map(async p => {
      const exists = await existsAsync(p.link);
      return exists ? null : p;
    })
  );

  const nonPublishedPosts = published.filter(Boolean);

  if (!nonPublishedPosts.length) {
    console.log("no more left to publish");
    return;
  }

  const payloads = nonPublishedPosts.map(p => ({
    topic: "manninen",
    messages: JSON.stringify(p)
  }));

  producer.send(payloads, function(err, data) {
    console.log(`published ${nonPublishedPosts.length} articles`);
    nonPublishedPosts.forEach(async post => {
      if (post) {
        await setAsync(post.link, 1);
      }
    });
  });
}
