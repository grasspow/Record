<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="record" href="/tabs/record">
          <ion-icon aria-hidden="true" :icon="createOutline" />
          <ion-label>记录</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="status" href="/tabs/status" @click="updateNameData">
          <ion-icon aria-hidden="true" :icon="statsChartOutline" />
          <ion-label>统计</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
  import { createOutline, statsChartOutline } from 'ionicons/icons';
  import { updateNameData } from '@/utils/data';
</script>
