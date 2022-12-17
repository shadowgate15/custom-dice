<template>
  <ion-item class="list-item" @click="onRoll">
    <Transition appear name="label">
      <ion-label class="ion-text-wrap">
        <h2>{{ group.name }}</h2>
      </ion-label>
    </Transition>
  </ion-item>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { IonLabel, IonItem } from "@ionic/vue";
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
