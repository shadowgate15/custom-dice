<template>
  <Transition name="list">
    <div class="result-list" v-if="recentResults.length">
      <TransitionGroup name="roll-results">
        <ion-card v-for="result in recentResults" :key="result.id">
          <RollResultContent :result="result" />
        </ion-card>
      </TransitionGroup>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IonCard } from "@ionic/vue";
import { ref } from "vue";
import {
  useDiceGroupsStore,
  RollResult,
  DiceGroupsState,
} from "@/stores/dice-groups";
import RollResultContent from "@/components/RollResultContent.vue";
import dayjs from "@/utils/dayjs";

const diceStore = useDiceGroupsStore();

const recentResults = ref<RollResult[]>([]);

diceStore.$subscribe((_, state: DiceGroupsState) => {
  const results = state.results.filter(
    (r) => !r.shown && r.date.isAfter(dayjs().subtract(5, "seconds"))
  );

  recentResults.value = results;

  if (results.length) {
    setTimeout(() => {
      for (const r of results) {
        const result = diceStore.results.find((r2) => r2.id === r.id);

        if (result) {
          result.shown = true;
        }
      }
    }, 5000);
  }
});
</script>

<style scoped>
ion-card {
  width: 90%;
}

.result-list {
  position: absolute;
  bottom: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;

  width: 100%;

  gap: var(--ion-margin, 1em);

  z-index: 20;
}

.roll-results-move,
.roll-results-enter-active,
.roll-results-leave-active,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.roll-results-enter-from,
.roll-results-leave-to {
  opacity: 0;
  transform: translateX(50vw);
}

.roll-results-leave-active {
  position: absolute;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(50vh);
}
</style>
