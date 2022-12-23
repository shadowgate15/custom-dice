<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Results</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Results</ion-title>
        </ion-toolbar>

        <ion-list>
          <RollResultListItem
            v-for="result in results"
            :key="result.id"
            :result="result"
          />
        </ion-list>
      </ion-header>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
} from "@ionic/vue";
import RollResultListItem from "@/components/RollResultListItem";
import { useDiceGroupsStore } from "@/stores/dice-groups";
import { computed } from "vue";

const diceStore = useDiceGroupsStore();

const results = computed(() => [...diceStore.results].reverse());
</script>
