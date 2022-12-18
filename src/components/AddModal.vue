<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="cancel()">Cancel</ion-button>
      </ion-buttons>

      <ion-title>Add Group</ion-title>

      <ion-buttons slot="end">
        <ion-button :strong="true" @click="confirm()">Done</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-item ref="nameInput">
      <ion-label> Name </ion-label>

      <ion-input
        v-model="name"
        placeholder="Name"
        @ionInput="validateName"
        :clearInput="true"
      ></ion-input>

      <ion-note slot="error"> Name is required. </ion-note>
    </ion-item>

    <ion-item-divider> </ion-item-divider>

    <ion-item>
      <ion-label> Theme </ion-label>

      <ion-select
        class="ion-text-capitalize"
        interface="action-sheet"
        placeholder="Theme"
        v-model="theme"
      >
        <ion-select-option
          v-for="t in themes"
          :key="t"
          :value="t"
          class="ion-text-capitalize"
        >
          {{ t }}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item @click="openColorModal(-1)">
      <ion-label> Color </ion-label>

      <div
        class="swatch"
        :style="{ 'background-color': color }"
        slot="end"
      ></div>
    </ion-item>

    <ion-item-divider> </ion-item-divider>

    <ion-list>
      <TransitionGroup name="dice-list">
        <ion-item-sliding
          v-for="(die, index) in dice"
          :key="index"
          :disabled="true"
        >
          <ion-item lines="full">
            <ion-icon
              slot="start"
              :icon="removeCircle"
              color="danger"
              @click="onRemove"
            />

            <ion-list class="dice-inputs">
              <ion-item
                :class="{
                  'ion-valid': die.qty > 0,
                  'ion-invalid': die.qty <= 0,
                }"
              >
                <ion-label>Number</ion-label>

                <ion-input
                  v-model="die.qty"
                  type="number"
                  placeholder="Number of dice"
                  :clearInput="true"
                >
                </ion-input>

                <ion-note slot="error">
                  Number is required and must be greater than 0.
                </ion-note>
              </ion-item>
              <ion-item>
                <ion-label> Sides </ion-label>

                <ion-select v-model="die.sides" interface="action-sheet">
                  <ion-select-option v-for="s in sides" :key="s" :value="s">
                    {{ s }}
                  </ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-label> Theme </ion-label>

                <ion-select
                  class="ion-text-capitalize"
                  interface="action-sheet"
                  placeholder="Theme"
                  v-model="theme"
                >
                  <ion-select-option
                    v-for="t in themes"
                    :key="t"
                    :value="t"
                    class="ion-text-capitalize"
                  >
                    {{ t }}
                  </ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item @click="openColorModal(index)">
                <ion-label> Color </ion-label>

                <div
                  class="swatch"
                  :style="{ 'background-color': die.themeColor || color }"
                  slot="end"
                ></div>
              </ion-item>
            </ion-list>
          </ion-item>

          <ion-item-options side="end" @click="onItemOptions">
            <ion-item-option color="danger" @click="onDelete(index)">
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        <ion-item ref="diceInput" lines="full" @click="onAddDice" :key="-1">
          <ion-icon slot="start" :icon="addCircle" color="success" />
          add dice

          <ion-input v-show="false" />

          <ion-note slot="error"> At least one die is required. </ion-note>
        </ion-item>
      </TransitionGroup>
    </ion-list>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonToolbar,
  IonButtons,
  IonButton,
  IonHeader,
  IonTitle,
  IonContent,
  IonItem,
  IonIcon,
  IonList,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItemDivider,
  IonNote,
  modalController,
} from "@ionic/vue";
import { addCircle, removeCircle } from "ionicons/icons";
import { ref, computed } from "vue";
import { DiceNotation, DiceSides, DiceThemes } from "@/stores/dice-groups";
import { COLOR_SELECT } from "@/utils/color-select";
import ColorModal from "@/components/ColorModal";

const nameInput = ref<typeof IonItem>();
const diceInput = ref<typeof IonItem>();

const name = ref<string>();
const theme = ref<DiceThemes>(DiceThemes.DEFAULT);
const color = ref<string>(COLOR_SELECT["peter river"]);
const dice = ref<DiceNotation[]>([]);

const themes = Object.values<string>(DiceThemes);
// have to slice because enums are weird
const sides = Object.values<number>(DiceSides).slice(6);

function cancel() {
  modalController.dismiss(null, "cancel");
}

function confirm() {
  const nameValid = validateName();
  const diceValid = validateDice();

  if (!nameValid || !diceValid) {
    return;
  }

  modalController.dismiss(
    {
      name: name.value,
      dice: {
        notation: dice.value,
        options: {
          theme: theme.value,
          themeColor: color.value,
        },
      },
    },
    "confirm"
  );
}

function validateName(): boolean {
  if (name.value?.length) {
    nameInput.value?.$el.classList.remove("ion-invalid");
    nameInput.value?.$el.classList.add("ion-valid");

    return true;
  }

  nameInput.value?.$el.classList.remove("ion-valid");
  nameInput.value?.$el.classList.add("ion-invalid");

  return false;
}

function validateDice(): boolean {
  if (dice.value?.length) {
    diceInput.value?.$el.classList.remove("ion-invalid");
    diceInput.value?.$el.classList.add("ion-valid");

    return true;
  }

  diceInput.value?.$el.classList.remove("ion-valid");
  diceInput.value?.$el.classList.add("ion-invalid");

  return false;
}

function onAddDice() {
  dice.value.push({
    sides: DiceSides.d6,
    qty: 1,
    theme: theme.value,
  });

  validateDice();
}

async function onRemove(ev: CustomEvent) {
  const slider = (ev.target as any).parentElement.parentElement;

  return slider.open();
}

async function onItemOptions(ev: CustomEvent) {
  const slider = (ev.target as any).parentElement;

  if (slider.close) {
    return slider.close();
  }
}

async function openColorModal(index: number) {
  const modal = await modalController.create({
    component: ColorModal,
    breakpoints: [0.0, 0.5, 1.0],
    initialBreakpoint: 0.5,
  });

  await modal.present();

  const { data, role } = await modal.onDidDismiss<string>();

  if (role === "ok" && data) {
    if (index === -1) {
      color.value = data;
    } else {
      dice.value[index].themeColor = data;
    }
  }
}

function onDelete(index: number) {
  dice.value?.splice(index, 1);

  validateDice();
}
</script>

<style scoped>
.dice-inputs {
  width: 100%;
}

.swatch {
  /* Rounded border */
  border-radius: 9999px;
  height: 1.5rem;
  width: 1.5rem;

  /* Space between items */
  margin: 0.5rem;
}

.dice-list-move,
.dice-list-enter-active,
.dice-list-leave-active {
  transition: all 0.3s ease;
}

.dice-list-enter-from,
.dice-list-leave-to {
  opacity: 0;
}

.dice-list-leave-active {
  position: absolute;
}
</style>
