import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import dayjs from "@/utils/dayjs";

export type DiceNotationMixed =
  | string
  | string[]
  | DiceNotation
  | DiceNotation[];

export interface DiceGroup {
  uuid: string;
  name: string;
  dice: Dice;
}

export interface Dice {
  notation: DiceNotationMixed;
  options?: DiceOptions;
}

// https://fantasticdice.games/docs/usage/objects#roll-object
export interface DiceNotation {
  /** the type of die to be rolled. Either a number such as 20 or a die type such as "fate". */
  sides: DiceSides;

  /** the number of dice to be rolled. Defaults to 1. */
  qty?: number;

  /** the modifier (positive or negative) to be added to the final results */
  modifier?: number;

  /** the theme's 'systemName' for this roll */
  theme?: DiceThemes;

  /** HEX value for the theme's material color */
  themeColor?: string;
}

export enum DiceSides {
  d4 = 4,
  d6 = 6,
  d8 = 8,
  d10 = 10,
  d12 = 12,
  d20 = 20,
}

export enum DiceThemes {
  DEFAULT = "default",
}

// https://fantasticdice.games/docs/usage/methods#options
export interface DiceOptions {
  theme?: DiceThemes;
  themeColor?: string;
  newStartPoint?: boolean;
}

// https://fantasticdice.games/docs/usage/objects#individual-die-result-object
export interface DieResult {
  /** the roll group this die belongs to */
  groupId: number;

  /** the unique identifier for this die within the group */
  rollId: number;

  /** the type of die */
  sides: DiceSides;

  /** the theme that was assigned to this die */
  theme: DiceThemes;

  /** HEX value for the theme's material color */
  themeColor?: string;

  /** the result for this die */
  value: number;
}

// https://fantasticdice.games/docs/usage/objects#roll-result-array-object
export interface RollGroup {
  /** the id of this group - should match the groupId of rolls */
  id: number;

  /** the roll modifier */
  modifier: any[];

  /** the number of dice in this roll */
  qty: number;

  /** an array of Die Result Objects */
  rolls: DieResult[];

  /** the type of die used */
  sides: DiceSides;

  /** the theme for this group of dice */
  theme: DiceThemes;

  /** the theme color for this group of dice */
  themeColor: string;

  /** the sum of the dice roll results and modifier */
  value: number;
}

export interface RollResult {
  id: string;
  uuid: string;
  results: RollGroup[];
  total: number;
  date: dayjs.Dayjs;
  shown?: boolean;
}

export function isRollResult(obj: any): obj is RollResult {
  return obj && obj.id && obj.uuid && obj.results && obj.total && obj.date;
}

export interface DiceGroupsState {
  groups: Map<string, DiceGroup>;
  results: RollResult[];
}

export const useDiceGroupsStore = defineStore("dice-groups", {
  state(): DiceGroupsState {
    return {
      groups: new Map<string, DiceGroup>(
        [
          createDiceGroup({
            name: "1d20",
            dice: {
              notation: "1d20",
            },
          }),
          createDiceGroup({
            name: "Red 1d20",
            dice: {
              notation: "1d20",
              options: {
                themeColor: "#e74c3c",
              },
            },
          }),
        ].map((g) => [g.uuid, g])
      ),
      results: [],
    };
  },
  getters: {
    asArray(): DiceGroup[] {
      return Array.from(this.groups.values());
    },
  },
  actions: {
    getGroup(uuid: string): DiceGroup | undefined {
      return this.groups.get(uuid);
    },
    addGroup(opts: Omit<DiceGroup, "uuid">): DiceGroup {
      const group = createDiceGroup(opts);

      this.groups.set(group.uuid, group);

      return group;
    },
    deleteGroup(uuid: string): void {
      this.results = this.results.filter((r) => r.uuid !== uuid);
      this.groups.delete(uuid);
    },
  },
});

function createDiceGroup(opts: Omit<DiceGroup, "uuid">): DiceGroup {
  const uuid = uuidv4();

  return { uuid, ...opts };
}
