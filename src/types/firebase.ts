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

export default interface DataModel {
  user: { [id: string]: User };
  guild: { [id: string]: Server };
}

interface Server {
  countingChannels:
    | {
        [id: string]: number;
      }
    | number;
}

export let initialServer: Server = {
  countingChannels: 0,
};

interface User {
  money: number;
  timelyClaims: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  cooldowns: {
    timely: number;
    coinflip: number;
    gamble: number;
    money: number;
    share: number;
  };
}

export let initialUser: User = {
  money: 0,
  timelyClaims: {
    hourly: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  },
  cooldowns: {
    timely: 0,
    coinflip: 0,
    gamble: 0,
    money: 0,
    share: 0,
  },
};

export let initialData: DataModel = {
  user: {
    1234: initialUser,
  },
  guild: {
    1234: initialServer,
  },
};
