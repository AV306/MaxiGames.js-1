/*
 * This file is part of the MaxiGames.js bot.
 * Copyright (C) 2021  the MaxiGames dev team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Client, ThreadChannel } from "discord.js";
import * as admin from "firebase-admin";
import moan from "../lib/moan";
import MGS from "../lib/statuses";
import { MGEmbed } from "../lib/flavoured";
import MGStatus from "../lib/statuses";
import { Guild, initialGuild, initialUser } from "../types/firebase";

export class FirebaseManager {
	db: admin.database.Database | undefined = undefined;
	calls = 0;

	public async init(client: Client) {
		this.db = admin.database();
		await this.initData();
		await this.announcement(client);
	}

	public async setData(ref: string, data: any): Promise<void> {
		await this.db?.ref(ref).set(data);
	}

	public async getData(ref: string): Promise<any> {
		let data = await this.db?.ref(ref).get();
		if (ref.split(`/`)[0] === "user" && data?.exists() === false) {
			await this.db?.ref(`user/${ref.split("/")[1]}`).set(initialUser);
			return initialUser;
		}
		if (ref.split(`/`)[0] === "guild" && data?.exists() === false) {
			await this.db?.ref(`guild/${ref.split("/")[1]}`).set(initialGuild);
			return initialGuild;
		}
		this.calls++;

		moan(MGS.Info, `getData was called ${this.calls} times!`);

		return data?.val();
	}

	private async initData() {
		let usr = await this.db?.ref(`/user`).get();
		let data = usr?.val();
		for (let i in data) {
			if (!data[i]["cooldowns"]["trivia"])
				data[i]["cooldowns"]["trivia"] = initialUser.cooldowns.trivia;
		}
		for (let i in data) {
			if (!data[i]["minigames"]["trivia"])
				data[i]["minigames"]["trivia"] = initialUser.minigames.trivia;
		}
		for (let i in data) {
			if (
				!data[i]["minigames"]["guessthecolour"] ||
				typeof data[i]["minigames"]["guessthecolour"] === "string"
			)
				data[i]["minigames"]["guessthecolour"] =
					initialUser.minigames.guessthecolour;
			if (!data[i]["minigames"]["escapethehouse"])
				data[i]["minigames"]["escapethehouse"] =
					initialUser.minigames.escapethehouse;
		}
		await this.db?.ref(`/user`).set(data);
		moan(MGS.Success, "initialised data for old database");
	}

	private async announcement(client: Client) {
		if (this.db === null || client === null) {
			return;
		}
		this.db?.ref("/announcement").on("value", async (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val() as string;
				if (data === "") {
					return;
				}
				client.guilds.cache.forEach(async (guild) => {
					try {
						await guild.systemChannel?.send({
							embeds: [
								MGEmbed(MGStatus.Success)
									.setTitle(
										"Important announcement by MaxiGames developers to all severs"
									)
									.setDescription(data),
							],
						});
					} catch {
						moan(
							MGS.Error,
							"While announcing, an error ocurred for " +
								guild.name
						);
					}
				});
				this.db?.ref("/announcement").set("");
			}
		});
	}
}

export const MGFirebase = new FirebaseManager();