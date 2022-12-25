<template>
  <ion-page ref="page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Dice Groups</ion-title>

        <ion-buttons slot="end">
          <ion-button expand="block" @click="onAdd">
            <ion-icon slot="icon-only" :icon="addOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
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

    <RollResults />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  modalController,
} from "@ionic/vue";
import { addOutline } from "ionicons/icons";
import { ref } from "vue";
import DiceGroupListItem from "@/components/DiceGroupListItem";
import AddModal from "@/components/AddModal";
import { useDiceGroupsStore, DiceGroup } from "@/stores/dice-groups";
import RollResults from "@/components/RollResults.vue";

const page = ref<typeof IonPage>();

const diceStore = useDiceGroupsStore();

async function onAdd() {
  const modal = await modalController.create({
    component: AddModal,
    presentingElement: page.value?.$el,
  });

  modal.present();

  const { data, role } = await modal.onDidDismiss<Omit<DiceGroup, "uuid">>();

  if (role === "confirm" && data) {
    diceStore.addGroup(data);
  }
}
</script>
