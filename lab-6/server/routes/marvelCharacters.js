const express = require("express");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

const axios = require("axios");

const md5 = require("blueimp-md5");
const publickey = "8fd857c8d1a419a427e45f7b26f3d946";
const privatekey = "294f35098a938885603fcefef98045971f42b0c3";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";

router.route("/page/:pagenum").get(async (req, res) => {
  try {
    let page = req.params.pagenum;
    if (page !== "") {
      if (page <= 0) {
        throw "negative page number or zero page number not allowed";
      }
    }
    if (!page) {
      page = 1;
    }
    let limit = 5;
    let offset = 0;
    if (page > 1) {
      offset = (page - 1) * limit;
    }
    let url =
      baseUrl +
      "?ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash +
      "&limit=" +
      limit +
      "&offset=" +
      offset;
    const { data } = await axios.get(url);
    if (data.data.results.length == 0)
      return res
        .status(404)
        .json({ error: "No more characters for the requested page" });
    const characters = data.data.results.map((character) => {
      const thumbnail =
        character.thumbnail.path + "." + character.thumbnail.extension;
      return {
        id: character.id,
        name: character.name,
        image: thumbnail,
        urls: character.urls,
      };
    });


    //redis 
    let pageNumbersExists = await client.exists('pageNumbers');
    let pageNumbers;
    if (pageNumbersExists === 0) {
      pageNumbers = [];
    } else {
      pageNumbers = await client.get('pageNumbers');
      pageNumbers = JSON.parse(pageNumbers);
    }
    if (!pageNumbers.includes(page)) {
      pageNumbers.push(page);
      await client.set('pageNumbers', JSON.stringify(pageNumbers));
    }
    await client.set(`page-${page}`, JSON.stringify(characters));
    

    res.status(200).json(characters);
  } catch (e) {
    if (e === "negative page number or zero page number not allowed") {
      return res.status(400).json({ error: e.message, e });
    } else return res.status(500).json({ error: e.message, e });
  }
});


module.exports = router;
