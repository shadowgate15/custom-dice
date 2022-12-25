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
import { COLOR_SELECT } from "@/utils/color-select";

export let diceBox: typeof DiceBox;

export const isRolling = computed<boolean>(() =>
  diceBox?.canvas.classList.contains("rolling")
);

let animation: Animation;
let uuid: string;

export async function initDiceBox(id: string) {
  const diceStore = useDiceGroupsStore();

  diceBox = new DiceBox(id, {
    scale: getScale(),
    throwForce: 10,
    themeColor: COLOR_SELECT["peter river"],
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

      diceBox.clear();
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

export function orientationChange() {
  if (diceBox) {
    diceBox.updateConfig({
      scale: getScale(),
    });

    window.dispatchEvent(new Event("resize"));
  }
}

function getScale() {
  return window.screen.orientation.type.indexOf("portrait") > -1 ? 4 : 8;
}
