import { Client } from "discord.js";
import math from "mathjs";
import { MGEmbed } from "../../lib/flavoured";
import MGStatus from "../../lib/statuses";
import { MGFirebase } from "../../utils/firebase";
import { Message } from "discord.js";

const countingListener = {
	name: "messageCreate",
	async execute(msg: Message) {
		if (msg.guild === null || msg.author.bot) {
			return;
		}

		const guildData = MGFirebase.getData(`guild/${msg?.guild?.id}`);
		if (guildData === undefined) {
			return;
		}

		if (!guildData["countingChannels"]) {
			return;
		}
		if (guildData["countingChannels"][msg.channel.id] === undefined) {
			return;
		}

		await MGFirebase.initUser(`${msg.author.id}`);

		// parse string
		const content = msg.content;
		let number = parseInt(content);
		if (isNaN(number)) {
			// do more checks
			const arr = content.split(/[^0-9, +,\-, *, /]/g);
			if (arr[0] === "") {return;}
			number = parseInt(math.evaluate(arr[0]));
			if (isNaN(number)) {return;}
		}

		// Yay time to check if it's right :)
		const curCount: number =
      guildData["countingChannels"][msg.channel.id]["count"];
		const id = guildData["countingChannels"][msg.channel.id]["id"];

		// same person?
		if (id === msg.author.id) {
			guildData["countingChannels"][msg.channel.id] = { count: 0, id: 0 };
			await MGFirebase.setData(`guild/${msg?.guild?.id}`, guildData);
			await msg.react("❌");
			await msg.reply({
				embeds: [
					MGEmbed(MGStatus.Error)
						.setTitle(`${msg.author.username} ruined it!`)
						.setDescription(
							`${msg.author.username} counted twice! The counter has been reset to 0.`
						),
				],
			});
			return;
		}

		if (number - 1 === curCount) {
			// correct!
			await msg.react("✅");
			guildData["countingChannels"][msg.channel.id] = {
				count: number,
				id: msg.author.id,
			};

			//show on statistics
			guildData["statistics"]["totalCount"] += 1;
			if (guildData["statistics"]["highestCount"] < number) {
				guildData["statistics"]["highestCount"] = number;
			}
			await MGFirebase.setData(`guild/${msg?.guild?.id}`, guildData);

			//add to personal statistics
			const userData = MGFirebase.getData(`user/${msg.author.id}`);
			userData["count"]["totalCount"]++;
			if (userData["count"]["highestCount"] < number) {
				userData["count"]["highestCount"] = number;
			}
			await MGFirebase.setData(`user/${msg.author.id}`, userData);
		} else {
			// wrong.
			await msg.react("❌");
			guildData["countingChannels"][msg.channel.id] = { count: 0, id: 0 };
			await MGFirebase.setData(`guild/${msg?.guild?.id}`, guildData);
			await msg.reply({
				embeds: [
					MGEmbed(MGStatus.Error)
						.setTitle(`${msg.author.username} ruined it!`)
						.setDescription(
							`${msg.author.username} counted ${number}, but the next count was ` +
							`${curCount + 1}. The counter has been reset to 0.`
						),
				],
			});
		}
	},
};

export default countingListener;
