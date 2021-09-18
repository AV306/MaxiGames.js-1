/*
 * File: src/commands/cases/uppercase.ts
 * Description: Handles uppercase command
 */

import { SlashCommandBuilder } from "@discordjs/builders";
import type MyCommand from "../../types/command";
import { MGEmbed } from "../../lib/flavoured";
import MGStatus from "../../lib/statuses";

let upperCaseFunc = require("lodash/upperCase") as (param: string) => string;

const upperCase: MyCommand = {
  data: new SlashCommandBuilder()
    .setName("uppercase")
    .setDescription("Convert some text into uppercase")
    .addStringOption((option) =>
      option
        .setName("string")
        .setDescription("Text that you want to change")
        .setRequired(true)
    ),

  async execute(interaction) {
    const toConvert = interaction.options.getString("string");

    if (toConvert === null) return; // please

    let embed = MGEmbed(MGStatus.Success)
      .setTitle("Succesfully uppercased!")
      .setDescription(`Uppercased Result: ${upperCaseFunc(toConvert)}`);

    await interaction.reply({ embeds: [embed] });
  },
};

export default upperCase;