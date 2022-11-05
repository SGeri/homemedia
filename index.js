require("dotenv").config();

const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const nCoreScraper = require("ncore-scraper");
const WebTorrent = require("webtorrent");
const commands = require("./commands");

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const torrentClient = new WebTorrent();

const scraperClient = new nCoreScraper({
  user: process.env.NCORE_USERNAME,
  pass: process.env.NCORE_PASSWORD,
  debug: process.env.SCRAPER_DEBUG === "true",
});

const generateMediaPath = (isSeries) => {
  return process.env.MEDIA_LOCATION + (isSeries ? "Shows" : "Movies");
};

// Register commands
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("An error occured:", error);
  }
})();

// Discord Client Initialization
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Handle commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Handle list command
  if (interaction.commandName === "list") {
    const torrents = torrentClient.torrents;

    if (torrents.length === 0)
      return interaction.reply("Nincs jelenleg futó torrent.");

    const formattedTorrentList = torrents.map(
      ({ name, progress }) => `- ${name} - (${Math.round(progress * 100)}%)`
    );

    await interaction.reply(
      "Jelenleg futó torrentek:\n" + formattedTorrentList
    );
  }

  // Handle torrent command
  if (interaction.commandName === "torrent") {
    const search = interaction.options.getString("search");
    const isSeries = interaction.options.getBoolean("is_series");

    if (!search) return await interaction.reply("Hiányzó argumentumok.");

    await interaction.reply("Keresés...");

    scraperClient.start(search).then(async (movieList) => {
      for ([key, value] of Object.entries(movieList)) {
        const { name, downloadUrl } = value.hu.hd[0];

        await interaction.channel.send("Torrent megtalálva: " + name);

        torrentClient.add(
          downloadUrl,
          { path: generateMediaPath(isSeries) },

          async function (torrent) {
            await interaction.channel.send("Letöltés megkezdése: " + name);

            torrent.on("done", async function () {
              await interaction.channel.send(
                `Sikeres letöltés (${name}), a fájlok elérhetőek a torrent mappában.`
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

  // Handle download command
  if (interaction.commandName === "download") {
    const downloadUrl = interaction.options.getString("url");
    const isSeries = interaction.options.getBoolean("is_series");

    if (!downloadUrl) return await interaction.reply("Hiányzó argumentumok.");

    await interaction.reply("Torrent megtalálva:", downloadUrl);

    torrentClient.add(
      downloadUrl,
      { path: generateMediaPath(isSeries) },

      async function (torrent) {
        await interaction.channel.send("Letöltés megkezdése: " + downloadUrl);

        torrent.on("done", async function () {
          await interaction.channel.send(
            `Sikeres letöltés (${downloadUrl}), a fájlok elérhetőek a torrent mappában.`
          );
        });
      }
    );
  }
});

torrentClient.on("error", async function (err) {
  const generalChannel = await client.channels.fetch(
    process.env.DISCORD_CHANNEL_ID
  );

  await generalChannel.send("An error occured:", err);
});

client.login(process.env.DISCORD_TOKEN);
