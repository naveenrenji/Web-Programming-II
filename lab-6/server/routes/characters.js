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

router.route("/:id").get(async (req, res) => {
  try {
    let id = req.params.id;
    let url =
      baseUrl +
      "/" +
      id +
      "?ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash;
    const { data } = await axios.get(url);
    if (data.data.results.length == 0)
      return res.status(404).json({ error: "No character found for that ID" });
    const characters = data.data.results.map((character) => {
      const thumbnail =
        character.thumbnail.path + "." + character.thumbnail.extension;
      const description = character.description === "" ? "No Description" : character.description;
      const comic = character.comics.items.length===0? "No Comic Available" : character.comics.items[0].name;
      return {
        id: character.id,
        name: character.name,
        description: description,
        comic: comic,
        image: thumbnail,
        urls: character.urls,
      };
    });
    await client.set(`character-${id}`, JSON.stringify(characters[0]));
    res.status(200).json(characters);
  } catch (e) {
    return res.status(500).json({ error: e.message, e });
  }
});

router.route("/search/:nameStartsWith").get(async (req, res) => {
  try {
    let nameStartsWith = req.params.nameStartsWith;
    let url =
      baseUrl +
      "?ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash +
      "&nameStartsWith=" +
      nameStartsWith;
    const { data } = await axios.get(url);
    if (data.data.results.length == 0)
      return res.status(404).json({ error: "No character found for that nameStartsWith" });
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
    //await client.set(`character-${id}`, JSON.stringify(characters[0]));
    res.status(200).json(characters);
  } catch (e) {
    return res.status(500).json({ error: e.message, e });
  }
});

module.exports = router;
