<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>统计</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card v-if="itemNameList.size > 0">
        <IonCardHeader>
          <IonCardSubtitle>筛选</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <template v-for="name in itemNameList" :key="name">
            <ion-button shape="round" fill="outline" size="small" @click="handleClickFilter(name)">{{ name
              }}</ion-button>
          </template>
          <IonButton expand="block" shape="round" fill="outline" size="small" color="danger" @click="resetData">清除筛选
          </IonButton>
        </IonCardContent>
      </ion-card>
      <ion-card v-for="[key, list] in data.entries()" :key="key">
        <IonCardHeader>
          <IonCardTitle>{{ key }}</IonCardTitle>
          <IonCardSubtitle>共计:{{ getTotal(list) }}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <ion-list>
            <ion-item lines="none" v-for="item in list" :key="item.time">
              <ion-label>{{ item.time }}</ion-label>
              <ion-label slot="end">数量:{{ item.value }}</ion-label>
            </ion-item>
          </ion-list>
        </IonCardContent>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonButton, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonList, IonItem, IonLabel } from '@ionic/vue';
  import { itemNameList, nameData, updateNameData } from '@/utils/data';
  import { onUpdated, reactive, watch } from 'vue';
  import { TimeValue } from '@/utils/interface';
  import _ from 'lodash'

  const data = reactive(_.cloneDeep(nameData))
  const getTotal = (a: TimeValue[]) => {
    let sum = 0;
    a.forEach(i => sum += i.value)
    return sum
  }
  onUpdated(() => {
    updateNameData();
  })

  const resetData = () => (nameData.forEach((list, key) => data.set(key, list)))
  watch(nameData, () => resetData())
  const handleClickFilter = (name: string) => {
    data.clear()
    nameData.forEach((list, key) => {
      if (key == name) data.set(key, list)
    })
  }
</script>
