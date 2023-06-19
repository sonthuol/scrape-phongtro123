const scrapeCategories = (browser, url) =>
  new Promise(async (resolve, rejects) => {
    try {
      let page = await browser.newPage();
      console.log(">>> Mở tab mới ...");
      await page.goto(url);
      console.log(">>> Truy cập vào trang web " + url);
      await page.waitForSelector("#webpage");
      console.log(">>> Trang web đã load xong");

      const dataCategory = await page.$$eval(
        "#navbar-menu > ul > li",
        (elements) => {
          dataCategory = elements.map((element) => {
            return {
              category: element.querySelector("a").innerText,
              link: element.querySelector("a").href,
            };
          });
          return dataCategory;
        }
      );
      console.log(dataCategory);
      console.log(">>> Tab đã đóng");

      await page.close();

      resolve(dataCategory);
    } catch (error) {
      console.log("Loi o scapre categories: " + error);
      rejects(error);
    }
  });

const scapre = (browser, url) =>
  new Promise(async (resolve, rejects) => {
    try {
      let newPage = await browser.newPage();
      console.log(">> Đã mở tab mới...");
      newPage.goto(url);
      console.log(">>> Đã truy cập vào trang " + url);
      await newPage.waitForSelector("#main");
      console.log(">>> Đã load xong trang web");

      const scraperData = {};

      // Get header
      const headerData = await newPage.$eval("header", (el) => {
        return {
          title: el.querySelector("h1").innerText,
          description: el.querySelector("p").innerText,
        };
      });

      scraperData.header = headerData;

      // Get link detail items
      const detailLinks = await newPage.$$eval(
        "#left-col > section.section-post-listing > ul li",
        (els) => {
          detailLinks = els.map((el) => {
            return el.querySelector(".post-meta > h3 > a").href;
          });
          return detailLinks;
        }
      );

      // Get detail page
      const scraperDetail = async (link) =>
        new Promise(async (resolve, rejects) => {
          try {
            let pageDetail = await browser.newPage();
            await pageDetail.goto(link);
            console.log(">> truy cap link " + link);
            await pageDetail.waitForSelector("#main");

            const detailData = {};
            // Bắt đầu cào
            // Cào ảnh
            const images = await pageDetail.$$eval(
              "#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide",
              (els) => {
                images = els.map((el) => {
                  if (el.querySelector("img")) {
                    return el.querySelector("img").src;
                  } else if (el.querySelector("video")) {
                    return el.querySelector("video > source").src;
                  }
                });
                return images;
              }
            );

            detailData.images = images;

            // Get header detail
            const header = await pageDetail.$eval(
              "header.page-header",
              (el) => {
                return {
                  title: el.querySelector("h1 > a").innerText,
                  star: el
                    .querySelector("h1 > span")
                    ?.className.replace(/^\D+/g, ""),
                  class: {
                    content: el.querySelector("p").innerText,
                    classType: el.querySelector("p > a > strong").innerText,
                  },
                  address: el.querySelector("address").innerText,
                  attributes: {
                    price: el.querySelector(
                      "div.post-attributes > .price > span"
                    ).innerText,
                    acreage: el.querySelector(
                      "div.post-attributes > .acreage > span"
                    ).innerText,
                    published: el.querySelector(
                      "div.post-attributes > .published > span"
                    ).innerText,
                    hashtag: el.querySelector(
                      "div.post-attributes > .hashtag > span"
                    ).innerText,
                  },
                };
              }
            );

            detailData.header = header;

            // Get thong tin mo ta
            const mainContentHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-main-content",
              (el) => el.querySelector("div.section-header > h2").innerText
            );
            const mainContentContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-main-content > div.section-content > p",
              (els) => (mainContentContent = els.map((el) => el.innerText))
            );

            detailData.mainContent = {
              header: mainContentHeader,
              content: mainContentContent,
            };

            // Dac diem tin dang
            const overviewHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-overview",
              (el) => el.querySelector("div.section-header > h3").innerText
            );
            const overviewContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-overview > div.section-content > table.table > tbody > tr",
              (els) =>
                els.map((el) => ({
                  name: el.querySelector("td:first-child").innerText,
                  content: el.querySelector("td:last-child").innerText,
                }))
            );

            detailData.overview = {
              header: overviewHeader,
              content: overviewContent,
            };

            // Dac diem lien he
            const contactHeader = await pageDetail.$eval(
              "#left-col > article.the-post",
              (el) =>
                el.querySelector("section.post-contact")
                  ? el.querySelector(
                      "section.post-contact > div.section-header > h3"
                    ).innerText
                  : null
            );
            const contactContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-contact > div.section-content > table.table > tbody > tr",
              (els) =>
                els.map((el) => ({
                  name: el.querySelector("td:first-child").innerText,
                  content: el.querySelector("td:last-child").innerText,
                }))
            );

            detailData.contact = {
              header: contactHeader,
              content: contactContent,
            };

            await pageDetail.close();
            console.log(">> Da dong tab " + link);
            resolve(detailData);
          } catch (error) {
            console.log("Lay data loi " + error);

            rejects(error);
          }
        });

      const details = [];
      for (let link of detailLinks) {
        const detail = await scraperDetail(link);
        details.push(detail);
      }

      scraperData.body = details;

      console.log(">>> Trinh duyet da dong");
      resolve(scraperData);
    } catch (error) {
      rejects(error);
    }
  });
module.exports = {
  scrapeCategories,
  scapre,
};
