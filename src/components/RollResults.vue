<template>
  <ion-fab class="ion-margin" slot="fixed" vertical="bottom" horizontal="end">
    <Transition name="list">
      <div class="result-list" v-if="showResults && diceStore.results.length">
        <TransitionGroup name="roll-results">
          <RollResultCard
            v-for="result in diceStore.results"
            :key="result.id"
            :result="result"
          />
        </TransitionGroup>
      </div>
      <div class="result-list" v-else-if="!showResults && recentResults.length">
        <TransitionGroup name="roll-results">
          <RollResultCard
            v-for="result in recentResults"
            :key="result.id"
            :result="result"
          />
        </TransitionGroup>
      </div>
    </Transition>
    <ion-fab-button
      @click="onShowResults"
      :color="showResults ? 'secondary' : 'primary'"
    >
      <ion-icon :icon="showResults ? closeOutline : listOutline" />
    </ion-fab-button>
  </ion-fab>
</template>

<script setup lang="ts">
import { IonFab, IonFabButton, IonIcon } from "@ionic/vue";
import { ref } from "vue";
import { listOutline, closeOutline } from "ionicons/icons";
import {
  useDiceGroupsStore,
  RollResult,
  isRollResult,
  DiceGroupsState,
} from "@/stores/dice-groups";
import RollResultCard from "@/components/RollResultCard";
import { SubscriptionCallbackMutation } from "pinia";

const showResults = ref(false);
const recentResults = ref<RollResult[]>([]);

const diceStore = useDiceGroupsStore();

function onShowResults() {
  showResults.value = !showResults.value;
}

diceStore.$subscribe(
  (mutation: SubscriptionCallbackMutation<DiceGroupsState>) => {
    const events = Array.isArray(mutation.events)
      ? mutation.events
      : [mutation.events];

    for (const e of events) {
      const { newValue } = e;

      if (isRollResult(newValue)) {
        recentResults.value = [...recentResults.value, newValue];

        // remove result after 5 seconds
        setTimeout(() => {
          recentResults.value = recentResults.value.filter(
            (result) => result.id !== newValue.id
          );
        }, 5000);
      }
    }
  }
);
</script>

<style scoped>
ion-fab {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--ion-margin, 1em);
  z-index: 20;

  min-width: 60vw;
  max-width: 60vw;
}

.result-list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  gap: var(--ion-margin, 1em);
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
