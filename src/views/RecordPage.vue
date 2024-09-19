<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>记录</ion-title>
        <ion-buttons slot="end" v-if="chosenDateTime != today">
          <ion-button @click="setToday">返回今天</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card>
        <IonCardContent>
          <ion-datetime ref="datepicker" presentation="date" :value="todayTime"
            @ion-change="handleDateChange"></ion-datetime>
        </IonCardContent>
      </ion-card>
      <ion-card>
        <IonCardContent>
          <ion-list>
            <template v-if="modalData.length > 0">
              <ion-item v-for="(item, index) in modalData" :key="index">
                <ion-label>项目名:{{ item.name }}</ion-label>
                <ion-label slot="end">数量:{{ item.value }}</ion-label>
              </ion-item>
            </template>
            <template v-else>
              <ion-item>
                <ion-label>
                  今日无数据
                </ion-label>
              </ion-item>
            </template>
          </ion-list>
        </IonCardContent>
      </ion-card>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" style="margin-right: 10vw;margin-bottom: 5vh;">
        <ion-fab-button @click="openModal()">
          <ion-icon :icon="modalData.length > 0 ? createOutline : addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <ion-modal :is-open="isOpen">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="cancelModalData">取消</ion-button>
          </ion-buttons>
          <ion-title>详情 / {{ chosenDateTime }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="addItem('')">
              <ion-icon :icon="addCircleOutline" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <template v-if="itemNameList.size > 0">
          <ion-card>
            <IonCardContent>
              <template v-for="item in itemNameList" :key="item">
                <ion-button shape="round" fill="outline" size="small" @click="addItem(item)">{{ item }}</ion-button>
              </template>
            </IonCardContent>
          </ion-card>
        </template>
        <ion-card v-for="item in modalData" :key="item.name">
          <IonCardContent>
            <ion-item lines="none">
              <ion-input :required="true" :value="item.name" @ion-change="item.name = $event.detail.value ?? ''"
                label="项目名:" type="text" placeholder="请输入项目名" />
            </ion-item>
            <ion-item lines="none">
              <ion-input :required="true" :value="item.value"
                @ion-input="item.value = parseInt($event.detail.value ?? '0')" label="数量:" type="number"
                placeholder="请输入数量" inputmode="numeric" />
            </ion-item>
          </IonCardContent>
          <ion-button @click="rmItem(item)" fill="clear" color="danger">删除此项</ion-button>
        </ion-card>
        <ion-card>
          <IonCardContent>
            <ion-button expand="block" @click="saveModalData">保存</ion-button>
          </IonCardContent>
        </ion-card>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonHeader, IonFab, IonModal, IonInput, IonFabButton, IonIcon, IonToolbar, IonButton, IonButtons, IonTitle, IonContent, IonCard, IonDatetime, IonCardContent, IonItem, IonLabel, IonList, DatetimeCustomEvent, alertController } from '@ionic/vue';
  import { addOutline, createOutline, addCircleOutline } from 'ionicons/icons';
  import { onMounted, reactive, ref } from 'vue';
  import { writeRecordFile, writeTimeListFile, writeItemNameListFile } from "@/utils/file"
  import toast from '@/utils/toast';
  import { data, timeList, itemNameList, updateNameData, initData } from '@/utils/data';
  import { NameValue } from '@/utils/interface';
  import { cloneDeep } from 'lodash';

  const todayTime = (new Date()).toISOString()
  const today = todayTime.split("T")[0]
  const chosenDateTime = ref(today)

  const datepicker = ref();
  const setToday = () => {
    if (datepicker.value) {
      datepicker.value.$el.reset()
    }
    chosenDateTime.value = today
    modalData.length = 0
    data.get(chosenDateTime.value)?.forEach(i => modalData.push(i))
  }

  const handleDateChange = (event: DatetimeCustomEvent) => {
    const value = event.detail.value ?? (new Date()).toISOString()
    chosenDateTime.value = (typeof (value) == "string" ? value : value.join()).split("T")[0]
    modalData.length = 0
    data.get(chosenDateTime.value)?.forEach(i => modalData.push(i))
  }

  const isOpen = ref(false);
  const modalData = reactive<Array<NameValue>>([])
  onMounted(() => {
    initData().then(() =>
      data.get(chosenDateTime.value)?.forEach(i => modalData.push(i))
    )
  })

  let oldModalData: NameValue[];
  const openModal = () => {
    oldModalData = cloneDeep(modalData)
    isOpen.value = true
  }
  const addItem = (name: string) => {
    if (modalData.find(item => item.name == name)) {
      toast.error("此项已添加")
      return
    }
    modalData.push({ name: name, value: 0 })
  }
  const rmItem = (item: NameValue) => {
    const data = modalData.filter(i => i != item)
    modalData.length = 0
    data.forEach(i => modalData.push(i))
  }
  const cancelModalData = async () => {
    const alert = await alertController.create({
      message: '是否取消?',
      buttons: [
        {
          text: '确定',
          role: 'confirm',
          handler: () => {
            modalData.length = 0
            oldModalData.forEach(i => modalData.push(i))
            isOpen.value = false
          },
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => { },
        },
      ],
    });
    await alert.present();
  }
  const saveModalData = async () => {
    const nameSet = new Set(modalData.map(i => i.name))
    if (nameSet.size != modalData.length || nameSet.has("")) {
      toast.error("有项目填写错误，请检查")
      return
    }
    const alert = await alertController.create({
      message: '是否保存?',
      buttons: [
        {
          text: '确定',
          role: 'confirm',
          handler: () => {
            timeList.add(chosenDateTime.value)
            modalData.forEach(item => itemNameList.add(item.name))
            data.set(chosenDateTime.value, [...modalData])
            writeTimeListFile(timeList)
            writeItemNameListFile(itemNameList)
            writeRecordFile(chosenDateTime.value, [...modalData])
            updateNameData()
            isOpen.value = false
            // console.log("timeList", timeList);
            // console.log("itemNameList", itemNameList);
            // console.log("data", data);
            // console.log("modalData", modalData);
          },
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => { },
        },
      ],
    });
    await alert.present();
  }
</script>
<style lang="scss" scoped></style>
