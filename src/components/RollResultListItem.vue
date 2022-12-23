<template>
  <ion-item lines="full">
    <RollResultContent :result="result" />
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem } from "@ionic/vue";
import { defineProps } from "vue";
import { RollResult } from "@/stores/dice-groups";
import RollResultContent from "@/components/RollResultContent";

defineProps<{
  result: RollResult;
}>();
</script>
