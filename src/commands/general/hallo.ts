export {};

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hallo")
    .setDescription("Say hallo to Maxigames :D")
    .addIntegerOption((option) =>
      option
        .setName("length")
        .setDescription("Length of the hallo message")
        .setRequired(false)
    ),
  async execute(interaction) {
    let length: Int = interaction.options.getInteger("length") || 5;
    if (length < 5 || length >= 2000) {
      await interaction.reply({
        content: "Invalid length!!! Length must be between 5 and 2000",
        ephemeral: true,
      });
      return;
    }
    length -= 3;
    const numberOfO = "o".repeat(length);
    await interaction.reply(`Hall${numberOfO}`);
  },
};
