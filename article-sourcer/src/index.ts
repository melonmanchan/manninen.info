import fetch from "node-fetch";
import cheerio from "cheerio";
const ILTALEHTI_URL = "https://www.is.fi/haku/?query=Tuomas%20Manninen";

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

  posts.forEach(async post => {
    console.log(post);
  });
}

main();
