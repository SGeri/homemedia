require("dotenv").config();

const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const nCoreScraper = require("ncore-scraper");
const WebTorrent = require("webtorrent");

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const scraperClient = new nCoreScraper({
  user: process.env.NCORE_USERNAME,
  pass: process.env.NCORE_PASSWORD,
  debug: true,
});

// Commands to register
const commands = [
  {
    name: "download",
    description:
      "It downloads a movie / show from nCore and syncs it to a Jellyfin server.",
    options: [
      {
        name: "display",
        description: "The displayed name on the media server.",
        type: 3,
        required: true,
      },
      {
        name: "search",
        description: "The term used to download the torrent file.",
        type: 3,
        required: true,
      },
    ],
  },
];

// Register commands
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// Discord Client Initialization
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Handle commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Handle download command
  if (interaction.commandName === "download") {
    const displayName = interaction.options.getString("display");
    const search = interaction.options.getString("search");

    if (!displayName || !search)
      return await interaction.reply("Hiányzó argumentumok.");

    await interaction.reply("Keresés...");

    scraperClient.start("Encanto 720p").then(async (movieList) => {
      for ([key, value] of Object.entries(movieList)) {
        const { name, downloadUrl } = value.hu.hd[0];

        await interaction.channel.send("Torrent megtalálva: " + name);

        const torrentClient = new WebTorrent({
          path: "./torrents",
        });

        torrentClient.add(
          downloadUrl,
          {
            path: "./torrents",
          },
          async function (torrent) {
            await interaction.channel.send(
              "Letöltés megkezdése: " + torrent.infoHash
            );

            torrent.on("done", async function () {
              await interaction.channel.send(
                "Sikeres letöltés, a fájlok elérhetőek a torrent mappában."
              );
            });
          }
        );

        torrentClient.on("error", async function (err) {
          await interaction.channel.send("Hiba történt: " + err);
        });
      }
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
