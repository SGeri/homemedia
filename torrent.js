require("dotenv").config();
const nCoreScraper = require("ncore-scraper");
const WebTorrent = require("webtorrent");
const util = require("util");

const search = ["Encanto 720p"];

const scraperOptions = {
  user: process.env.NCORE_USERNAME,
  pass: process.env.NCORE_PASSWORD,
  debug: true,

  searchTerms: search,
};
const scraperClient = new nCoreScraper(scraperOptions);

const torrentOptions = {
  path: "./torrents",
};
const torrentClient = new WebTorrent(torrentOptions);

main();

async function main() {
  scraperClient.start().then((movieList) => {
    console.log(util.inspect(movieList, false, null, true));

    for ([key, value] of Object.entries(movieList)) {
      const { name, downloadUrl } = value.hu.hd[0];

      console.log(name, downloadUrl);

      torrentClient.add(
        downloadUrl,
        {
          path: "./torrents",
        },
        function (torrent) {
          console.log("Client is downloading:", torrent.infoHash);

          torrent.files.forEach(function (file) {
            console.log("Downloading file:", file.path);
          });
        }
      );
    }
  });
}

torrentClient.on("error", function (err) {
  console.log("ERROR: " + err);
});

torrentClient.on("download", function (info) {
  console.log("downloaded: " + torrentClient.progress);
});

torrentClient.on("done", function () {
  console.log("torrent download finished");
});
