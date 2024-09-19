import { reactive } from "vue"
import { readTimeListFile, writeTimeListFile, readItemNameListFile, writeItemNameListFile, readRecordFile } from "./file"
import { NameValue, TimeValue } from "./interface";

export const data: Map<string, Array<NameValue>> = reactive(new Map())
export const timeList = reactive<Set<string>>(new Set())
export const itemNameList = reactive<Set<string>>(new Set());

export const nameData: Map<string, Array<TimeValue>> = reactive(new Map())
export const updateNameData = async () => {
  nameData.clear()
  // 遍历 a 中的每个键值对
  data.forEach((nameValueArray, timeKey) => {
    nameValueArray.forEach((nameValue) => {
      // 如果 b 中已经有这个 name，则追加到对应数组中
      if (nameData.has(nameValue.name)) {
        nameData.get(nameValue.name)?.push({ time: timeKey, value: nameValue.value });
        nameData.get(nameValue.name)?.sort((a, b) => (parseInt(a.time.split("-").join("")) - parseInt(b.time.split("-").join(""))));
      } else {
        // 否则创建一个新的数组
        nameData.set(nameValue.name, [{ time: timeKey, value: nameValue.value }]);
      }
    });
  });
};

export const initData = async () => {
  await readTimeListFile().then(res => res.forEach((i: string) => timeList.add(i))).catch(() => writeTimeListFile(timeList))
  timeList.forEach(time => {
    readRecordFile(time).then(res => data.set(time, res));
  })
  await readItemNameListFile().then(res => res.forEach((i: string) => itemNameList.add(i))).catch(() => writeItemNameListFile(itemNameList))
}


