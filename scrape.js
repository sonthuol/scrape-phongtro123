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

      resolve();
    } catch (error) {
      console.log("Loi o scapre categories: " + error);
      rejects(error);
    }
  });

module.exports = {
  scrapeCategories,
};
