<template>
  <ion-item class="list-item">
    <Transition appear name="label">
      <ion-label class="ion-text-wrap">
        <ion-grid>
          <ion-row class="ion-align-items-center">
            <ion-col>
              <h2>{{ group.name }}</h2>
            </ion-col>
            <ion-col size="auto">
              <ion-button
                class="roll-btn"
                shape="round"
                fill="outline"
                size="small"
                @click="onRoll"
              >
                Roll
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-label>
    </Transition>
  </ion-item>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import {
  IonLabel,
  IonItem,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/vue";
import { DiceGroup } from "@/stores/dice-groups";
import { rollDice } from "@/composables/dice-box";

const props = defineProps<{
  group: DiceGroup;
}>();

async function onRoll() {
  await rollDice(
    props.group.uuid,
    props.group.dice.notation,
    props.group.dice.options
  );
}
</script>

<style scoped>
.list-item h2 {
  font-weight: 600;
}

.label-enter-active,
.label-leave-active {
  transition: all 0.5s ease;
}

.label-enter-from,
.label-leave-to {
  opacity: 0;
  transform: translateX(100vw);
}
</style>
