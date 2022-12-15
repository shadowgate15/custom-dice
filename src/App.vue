<template>
  <ion-app>
    <ion-router-outlet />
    <canvas id="dice-canvas"></canvas>
    <RollResults v-if="isHome" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { initDiceBox } from "@/composables/dice-box";
import RollResults from "@/components/RollResults";

const route = useRoute();

const isHome = computed(() => route.name === "Home");

onMounted(async () => {
  await initDiceBox("#dice-canvas");
});
</script>

<style>
#dice-canvas {
  position: absolute;

  width: 100vw;
  height: 100vh;

  z-index: 10;

  pointer-events: none;
}

#dice-canvas.rolling {
  opacity: 1;
}
</style>
