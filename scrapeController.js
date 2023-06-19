const scrapes = require("./scrape");
const fs = require("fs");
const scrapeController = async (browserInstance) => {
  let url = "https://phongtro123.com/";
  let indexs = [1, 2, 3, 4];
  try {
    let browser = await browserInstance;
    const categories = await scrapes.scrapeCategories(browser, url);
    const selectedCategories = categories.filter((category, index) =>
      indexs.some((i) => i === index)
    );
    let result_chothuephongtro = await scrapes.scapre(
      browser,
      selectedCategories[0].link
    );
    fs.writeFile(
      "chothuephongtro.json",
      JSON.stringify(result_chothuephongtro),
      (err) => {
        if (err) console.log("Ghi log data that bai " + err);
        console.log("Ghi log data thanh cong");
      }
    );
    let result_nhachothue = await scrapes.scapre(
      browser,
      selectedCategories[1].link
    );
    fs.writeFile(
      "nhachothue.json",
      JSON.stringify(result_nhachothue),
      (err) => {
        if (err) console.log("Ghi log data that bai " + err);
        console.log("Ghi log data thanh cong");
      }
    );
    let result_chothuecanho = await scrapes.scapre(
      browser,
      selectedCategories[2].link
    );
    fs.writeFile(
      "chothuecanho.json",
      JSON.stringify(result_chothuecanho),
      (err) => {
        if (err) console.log("Ghi log data that bai " + err);
        console.log("Ghi log data thanh cong");
      }
    );
    let result_chothuematbang = await scrapes.scapre(
      browser,
      selectedCategories[3].link
    );
    fs.writeFile(
      "chothuematbang.json",
      JSON.stringify(result_chothuematbang),
      (err) => {
        if (err) console.log("Ghi log data that bai " + err);
        console.log("Ghi log data thanh cong");
      }
    );
  } catch (error) {
    console.log("Loi o scrape controller: " + error);
  }
};

module.exports = scrapeController;
