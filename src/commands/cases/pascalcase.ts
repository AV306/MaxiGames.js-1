/*
 * File: src/commands/cases/pascalcase.ts
 * Description: pascalcase handler
 */

import { SlashCommandBuilder } from "@discordjs/builders";
import type MyCommand from "../../types/command";
import { MGEmbed } from "../../lib/flavoured";
import MGStatus from "../../lib/statuses";

let pascalCasedFunc = function (string: string) {
  return `${string}`
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w+)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, "g"), "")
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
};

// yes
const pascalCase: MyCommand = {
  data: new SlashCommandBuilder()
    .setName("pascalcase")
    .setDescription("Convert some text into pascalcase")
    .addStringOption((option) =>
      option
        .setName("string")
        .setDescription("Text that you want to change")
        .setRequired(true)
    ),

  // same thing as before
  // this is getting old :(
  async execute(interaction) {
    const toConvert = interaction.options.getString("string");

    if (toConvert === null) return; //

    let embed = MGEmbed(MGStatus.Success)
      .setTitle("Succesfully pascalcased!")
      .setDescription(`PascalCase Result: ${pascalCasedFunc(toConvert)}`);

    await interaction.reply({ embeds: [embed] });
  },
};

export default pascalCase;
