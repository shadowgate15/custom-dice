<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="dice" href="/tabs/dice">
          <ion-icon :icon="dice" />
          <ion-label>Dice</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="results" href="/tabs/results">
          <ion-icon :icon="list" />
          <ion-label>Results</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonIcon,
} from "@ionic/vue";
import { dice, list } from "ionicons/icons";
</script>
