const express = require("express");
const router = express.Router();
const Feed = require("../models/feed");
const request = require("request");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

class scrapService {
  constructor() {
    this.news = [];
    this.url1 = "https://www.elmundo.es";
    this.url2 = "https://elpais.com";
  }

  get_pageEP() {
    request(this.url2, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const promises = [];
        const articles = $(".articulo");

        articles.each((i, elem) => {
          if (i < 5) {
            const title = $(elem)
              .find(".articulo-titulo")
              .text()
              .replace(/\r?\n|\r/g, "");
            const body = $(elem)
              .find(".articulo-entradilla")
              .text();
            const link = $(elem)
              .find("a")
              .attr("href")
              .replace(/\s\s+/g, "");
            let imgPath = $(elem)
              .find("figure > a > img")
              .attr("data-src");
            let imgName;
            if (!imgPath) {
              imgPath = "";
              imgName = "Image not available";
            } else {
              imgPath = "https:" + imgPath;
              imgName = $(elem)
                .find("figure > a > img")
                .attr("alt");
            }
            let source =
              $(elem)
                .find(".autor-nombre")
                .text()
                .replace(/\s\s+/g, "")
                .replace(/\r?\n|\r/g, "") +
              " | " +
              $(elem)
                .find(".articulo-localizaciones")
                .text()
                .replace(/\s\s+/g, "")
                .replace(/\r?\n|\r/g, "");

            const feed = {
              title,
              body,
              link,
              image: {
                imgPath,
                imgName
              },
              source,
              publisher: "EL PAÍS"
            };
            this.news.push(feed);
            promises.push(Feed.create(feed));
          }
        });
        console.log(this.news);
        Promise.all(promises)
          .then(() => {
            console.log("Succesfully saved");
          })
          .catch(e => console.log(e));
      }
    });
  }

  get_pageEM() {
    request(
      {
        url: this.url1,
        encoding: null
      },
      (error, response, html) => {
        if (!error && response.statusCode == 200) {
          html = iconv.decode(html, "ISO-8859-1");
          const $ = cheerio.load(html);
          const promises = [];
          const articles = $("article");
          articles.each((i, elem) => {
            if (i < 5) {
              const title = $(elem)
                .find("h2")
                .text()
                .replace(/\r?\n|\r/g, "");
              const body = $(elem)
                .find("p")
                .text()
                .replace(/\s\s+/g, "");
              const link = $(elem)
                .find("a")
                .attr("href")
                .replace(/\s\s+/g, "");
              let imgPath = $(elem)
                .find("figure > img")
                .attr("src");
              let imgName;
              if (!imgPath) {
                imgPath = "";
                imgName = "Image not available";
              } else {
                imgName = $(elem)
                  .find("figure > img")
                  .attr("alt");
              }
              const source =
                $(elem)
                  .find(".ue-c-cover-content__byline-name")
                  .text()
                  .replace(/\s\s+/g, " ")
                  .replace(/\r?\n|\r/g, " ") +
                "| " +
                $(elem)
                  .find(".ue-c-cover-content__byline-location")
                  .text()
                  .replace(/\s\s+/g, "")
                  .replace(/\r?\n|\r/g, "");

              const feed = {
                title,
                body,
                link,
                image: {
                  imgPath,
                  imgName
                },
                source,
                publisher: "EL MUNDO"
              };
              this.news.push(feed);
              promises.push(Feed.create(feed));
            }
          });
          console.log(this.news);
          Promise.all(promises)
            .then(() => {
              console.log("Succesfully saved");
            })
            .catch(e => console.log(e));
        }
      }
    );
  }
}

module.exports = scrapService;
