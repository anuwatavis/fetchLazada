const axios = require("axios");
const fs = require("fs");
const { constants } = require("buffer");

const rawdata = fs.readFileSync("air-fryer-5000.json");
const dataObject = JSON.parse(rawdata);
const item = dataObject.data;

const reportItem = item.reportItem;

const itemIdData = [];
reportItem.forEach((item) => {
  itemIdData.push({ id: item.itemId });
});

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const finalUrl = (url, count, itemId) => {
  let countItem = 0;
  axios.get(url).then((response) => {
    countItem = response.data.model.paging["totalItems"];
    let url2 = `https://my.lazada.co.th/pdp/review/getReviewList?itemId=${itemId}&pageSize=${countItem}&filter=0&sort=0&pageNo=0`;
    getData(url2, count);
  });
};

var store = [];

let data = [];
let x = [];
const getData = async (url) => {
  await axios.get(url).then((response) => {
    let items = response.data.model["items"];
    let data = [];
    items.forEach((item) => {
      data.push({
        itemId: item.itemId,
        itemTitle: item.itemTitle,
        rating: item.rating,
        reviewContent: item.reviewContent,
        isAnonymous: item.isAnonymous,
      });
    });
    store.push(data);
  });
};

const render_csv = async (data) => {
  const csvWriter = createCsvWriter({
    path: `out${count}.csv`,
    header: [
      { id: "itemId", title: "itemId" },
      { id: "itemTitle", title: "itemTitle" },
      { id: "rating", title: "rating" },
      { id: "reviewContent", title: "reviewContent" },
      { id: "isAnonymous", title: "isAnonymous" },
    ],
  });
  await csvWriter.writeRecords(data);
  console.log("done");
};

let start = 0;
let end = 1;
let count = start;
console.log("----------------print-------------");
// itemIdData.slice(start, end).forEach((item, index) => {
//   let url = `https://my.lazada.co.th/pdp/review/getReviewList?itemId=${item.id}&pageSize=5&filter=0&sort=0&pageNo=0`;
//   // finalUrl(url);
//   console.log(url);
//   finalUrl(url, count, item.id);
//   count = count + 1;
// });

const get = async () => {
  for (let index = 2244; index <= 2250; index++) {
    let itemId = itemIdData[index].id;
    console.log(itemId);
    const fetchUrl = await axios.get(
      `https://my.lazada.co.th/pdp/review/getReviewList?itemId=${itemId}&pageSize=5&filter=0&sort=0&pageNo=0`
    );
    let reviewCount = await fetchUrl.data;
    console.log(reviewCount["model"]);
    if (typeof reviewCount["model"] === "undefined") {
      console.log(itemId);
      console.log("=============undefined============");
    } else {
      if (reviewCount["model"]["paging"] === null) {
        console.log("--------------------------null-----------------------------");
      } else {
        reviewCount = reviewCount["model"]["paging"]["totalItems"];
        console.log(reviewCount);
        const fetch = await axios.get(
          `https://my.lazada.co.th/pdp/review/getReviewList?itemId=${itemId}&pageSize=${reviewCount}&filter=0&sort=0&pageNo=0`
        );
        let data = await fetch.data;
        data = data["model"]["items"];
        const csvWriter = createCsvWriter({
          path: `out${index}.csv`,
          header: [
            { id: "itemId", title: "itemId" },
            { id: "sellerId", title: "sellerId" },
            { id: "buyerId", title: "buyerId" },
            { id: "itemTitle", title: "itemTitle" },
            { id: "reviewType", title: "reviewType" },
            { id: "rating", title: "rating" },
            { id: "reviewContent", title: "reviewContent" },
            { id: "isAnonymous", title: "isAnonymous" },
            { id: "boughtDate", title: "boughtDate" },
            { id: "reviewTime", title: "reviewTime" },
          ],
        });
        let data2 = [];
        data.forEach((item) => {
          data2.push({
            itemId: item.itemId,
            sellerId: item.sellerId,
            buyerId: item.buyerId,
            itemTitle: item.itemTitle,
            reviewType: item.reviewType,
            rating: item.rating,
            reviewContent: item.reviewContent,
            isAnonymous: item.isAnonymous,
            boughtDate: item.boughtDate,
            reviewTime: item.reviewTime,
          });
        });
        console.log(data2);
        await csvWriter.writeRecords(data2);
      }
    }
  }
};

console.log(itemIdData.slice(275, 276));
get();
