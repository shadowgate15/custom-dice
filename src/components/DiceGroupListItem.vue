<template>
  <ion-item-sliding>
    <ion-item class="list-item" @click="onRoll">
      <Transition appear name="label">
        <ion-label class="ion-text-wrap">
          <h2>{{ group.name }}</h2>
        </ion-label>
      </Transition>
    </ion-item>

    <ion-item-options side="end">
      <ion-item-option color="danger" @click="onDelete()">
        Delete
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import {
  IonLabel,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
} from "@ionic/vue";
import { DiceGroup, useDiceGroupsStore } from "@/stores/dice-groups";
import { rollDice } from "@/composables/dice-box";

const diceStore = useDiceGroupsStore();

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

function onDelete() {
  diceStore.deleteGroup(props.group.uuid);
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
