import fetch from "node-fetch";
import cheerio from "cheerio";
import kafka from "kafka-node";
const ILTALEHTI_URL = "https://www.is.fi/haku/?query=Tuomas%20Manninen";

const client = new kafka.KafkaClient();
const producer = new kafka.Producer(client);

producer.on("ready", main);
producer.on("error", (err: any) => {
  console.error(err);
  process.exit(-1);
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

  const payloads = posts.map(p => ({
    topic: "manninen",
    messages: JSON.stringify(p)
  }));

  producer.send(payloads, function(err, data) {
    console.log(data);
  });
}
