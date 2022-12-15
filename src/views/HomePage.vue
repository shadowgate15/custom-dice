<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Dice Groups</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Dice Groups</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <DiceGroupListItem
          v-for="group in diceStore.asArray"
          :key="group.uuid"
          :group="group"
        />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import DiceGroupListItem from "@/components/DiceGroupListItem";
import { useDiceGroupsStore } from "@/stores/dice-groups";

const diceStore = useDiceGroupsStore();

function refresh(ev: CustomEvent) {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
}
</script>
