export {};

const fs = require("fs");
const path = require("path");
const process = require("process");
const { Client, Collection, Intents } = require("discord.js");
const { tokenId } = require("./config.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands: Map<string, JSON> = new Map();

// NOTE: The directory "commands" should contain subdirectories to organise js commands.
const commandFiles: Array<[string, Array<string>]> = fs
  .readdirSync("./commands")
  .map((file: string) => path.join("./commands", file))
  .filter((file: string) => fs.lstatSync(file).isDirectory())
  .map((dir: string) => [
    dir,
    fs.readdirSync(dir).filter((file: string) => file.endsWith(".js")),
  ]);

for (const filecol of commandFiles) {
  for (const name of filecol[1]) {
    const command = require(`./${path.join(filecol[0], name)}`);
    commands.set(command.data.name, command);
  }
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const command = commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(require(`../config.json`)["tokenIdBeta"]);
