const scrapes = require("./scrape");

const scrapeController = async (browserInstance) => {
  let url = "https://phongtro123.com/";
  try {
    let browser = await browserInstance;
    let categories = await scrapes.scrapeCategories(browser, url);
  } catch (error) {
    console.log("Loi o scrape controller: " + error);
  }
};

module.exports = scrapeController;
