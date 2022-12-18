<template>
  <ion-content>
    <ion-list>
      <ion-item
        v-for="c in Object.entries(COLOR_SELECT)"
        :key="c[0]"
        class="ion-text-capitalize"
        @click="onSelect(c[1])"
      >
        <div class="swatch" :style="{ 'background-color': c[1] }"></div>
        {{ c[0] }}
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script setup lang="ts">
import { IonContent, IonItem, IonList, modalController } from "@ionic/vue";
import { COLOR_SELECT } from "@/utils/color-select";

function onSelect(color: string) {
  modalController.dismiss(color, "ok");
}
</script>

<style scoped>
.swatch {
  /* Rounded border */
  border-radius: 9999px;
  height: 1.5rem;
  width: 1.5rem;

  /* Space between items */
  margin: 0.5rem;
}
</style>
