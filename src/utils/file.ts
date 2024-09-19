import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/vue';

const checkStoragePermission = async () => {
  let a = await Filesystem.checkPermissions()
  while (a.publicStorage == "denied") {
    a = await Filesystem.requestPermissions()
  }
}

export const readRecordFile = async (filename: string) => {
  if (isPlatform("android")) {
    await checkStoragePermission()
    const data = await Filesystem.readFile(
      {
        path: "Record/record/" + filename + ".txt",
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      }
    )
    if (data.data instanceof Blob) return {}
    return JSON.parse(data.data) ?? {}
  } else {
    const data = await Preferences.get({ key: filename })
    if (data.value == null) return {}
    return JSON.parse(data.value) ?? {}
  }
}

export const writeRecordFile = async <T>(filename: string, data: T) => {
  if (isPlatform("android")) {
    await checkStoragePermission()
    await Filesystem.writeFile(
      {
        path: "Record/record/" + filename + ".txt",
        data: JSON.stringify(data),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true
      }
    )
  } else {
    await Preferences.set({ key: filename, value: JSON.stringify(data) })
  }
}

export const readTimeListFile = async () => {
  return readListFile("timeList")
}
export const readItemNameListFile = async () => {
  return readListFile("itemNameList")
}
export const writeTimeListFile = async <T>(data: T) => {
  return writeListFile("timeList", data)
}
export const writeItemNameListFile = async <T>(data: T) => {
  return writeListFile("itemNameList", data)
}

const readListFile = async (name: string) => {
  if (isPlatform("android")) {
    await checkStoragePermission()
    const data = await Filesystem.readFile(
      {
        path: "Record/" + name + ".txt",
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      }
    )
    if (data.data instanceof Blob) return []
    return JSON.parse(data.data) ?? []
  } else {
    const data = await Preferences.get({ key: name })
    if (data.value == null) return []
    return JSON.parse(data.value) ?? []
  }
}

const writeListFile = async <T>(name: string, _data: T) => {
  let data
  if (_data instanceof Set) data = [..._data]
  else data = _data
  if (isPlatform("android")) {
    await checkStoragePermission()
    await Filesystem.writeFile(
      {
        path: "Record/" + name + ".txt",
        data: JSON.stringify(data),
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      }
    )
  } else {
    await Preferences.set({ key: name, value: JSON.stringify(data) })
  }
}