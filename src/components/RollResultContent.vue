<template>
  <ion-grid>
    <ion-row class="ion-align-items-center">
      <ion-col>
        <p class="m">{{ result.date.fromNow() }}</p>
        <h2 class="m">
          <ion-text color="primary">FROM: </ion-text>
          <ion-text color="secondary">
            {{ diceStore.getGroup(result.uuid)?.name }}
          </ion-text>
        </h2>
        <h3 class="m">
          <template v-for="(group, iGroup) in result.results" :key="group.id">
            <template v-for="(roll, iRoll) in group.rolls" :key="roll.rollId">
              <span :style="getTextColor(roll)">{{ roll.value }}</span>
              <template v-if="iRoll < group.rolls.length - 1"> + </template>
            </template>
            <template v-if="iGroup < result.results.length - 1"> + </template>
          </template>
        </h3>
      </ion-col>
      <ion-col size="auto">
        <h2>=</h2>
      </ion-col>
      <ion-col size="auto">
        <ion-text color="success">
          <h1>{{ result.total }}</h1>
        </ion-text>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { IonGrid, IonRow, IonCol, IonText } from "@ionic/vue";
import { defineProps } from "vue";
import {
  useDiceGroupsStore,
  DieResult,
  RollResult,
} from "@/stores/dice-groups";

defineProps<{
  result: RollResult;
}>();

const diceStore = useDiceGroupsStore();

function getTextColor(roll: DieResult) {
  if (roll.themeColor) {
    return { color: roll.themeColor };
  }

  return {};
}
</script>

<style scoped>
ion-col {
  padding-top: 0;
  padding-bottom: 0;
}

.m {
  margin: 0.15em 0;
}
</style>
