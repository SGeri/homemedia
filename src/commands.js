// old export
module.exports = [
  {
    name: "list",
    description:
      "It lists the currently active torrents (both downloading and seeding).",
  },

  {
    name: "torrent",
    description:
      "It looks up a torrent file and tries to download it from nCore and uploads to Media Library.",
    options: [
      {
        name: "search",
        description: "The term used to download the torrent file.",
        type: 3,
        required: true,
      },
      {
        name: "is_series",
        description: "Set to true if the type of media is a series.",
        type: 5,
        required: true,
      },
    ],
  },

  {
    name: "download",
    description:
      "It downloads a torrent from URL and uploads to Media Library.",
    options: [
      {
        name: "url",
        description: "The URL of the torrent file.",
        type: 3,
        required: true,
      },
      {
        name: "is_series",
        description: "Set to true if the type of media is a series.",
        type: 5,
        required: true,
      },
    ],
  },
];
