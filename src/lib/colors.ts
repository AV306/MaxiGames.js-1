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

import { ColorResolvable } from 'discord.js';
import MGStatus from './statuses';

const COLOR_PALETTE: { [k in MGStatus]: ColorResolvable } = {
	[MGStatus.Info]: '#81a1c1',
	[MGStatus.Default]: '#4c566a',
	[MGStatus.Warn]: '#ebcb8b',
	[MGStatus.Success]: '#a3be8c',
	[MGStatus.Error]: '#bf616a',
};

export default COLOR_PALETTE;
