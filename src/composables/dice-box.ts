import {
  DiceNotationMixed,
  DiceOptions,
  RollGroup,
  useDiceGroupsStore,
} from "@/stores/dice-groups";
import DiceBox from "@3d-dice/dice-box";
import { computed } from "vue";
import { createAnimation, Animation } from "@ionic/vue";
import { v4 as uuidv4 } from "uuid";
import dayjs from "@/utils/dayjs";

export let diceBox: typeof DiceBox;

export const isRolling = computed<boolean>(() =>
  diceBox?.canvas.classList.contains("rolling")
);

let animation: Animation;
let uuid: string;

export async function initDiceBox(id: string) {
  const diceStore = useDiceGroupsStore();

  diceBox = new DiceBox(id, {
    scale: 4,
    throwForce: 10,
    onRollComplete: async (results: RollGroup[]) => {
      diceBox.canvas.classList.remove("rolling");

      // add result to store
      diceStore.results.push({
        id: uuidv4(),
        uuid,
        results,
        total: results.reduce((total, result) => total + result.value, 0),
        date: dayjs(),
      });

      // play animation to fade out the dice
      animation = createAnimation()
        .addElement(diceBox.canvas)
        .delay(2500)
        .duration(1500)
        .iterations(1)
        .fromTo("opacity", "1", "0");

      await animation.play();
    },
  });

  await diceBox.init();
}

export function isReady() {
  return computed(() => !!diceBox);
}

export async function rollDice(
  id: string,
  notation: DiceNotationMixed,
  options?: DiceOptions
) {
  if (animation) {
    animation.stop();
  }

  if (diceBox) {
    diceBox.canvas.classList.add("rolling");

    uuid = id;
    await diceBox.roll(notation, options);
  }
}
