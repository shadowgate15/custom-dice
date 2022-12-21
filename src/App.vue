<template>
  <ion-app>
    <ion-router-outlet />

    <canvas id="dice-canvas"></canvas>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { onMounted } from "vue";
import { initDiceBox } from "@/composables/dice-box";

onMounted(async () => {
  await initDiceBox("#dice-canvas");
});
</script>

<style>
#dice-canvas {
  position: absolute;

  width: 100%;
  height: 100%;

  z-index: 10;

  pointer-events: none;
}

#dice-canvas.rolling {
  opacity: 1;
}
</style>
