import { toastController } from '@ionic/vue';

const info = async (message: string) => {
  await base(message, "info")
}
const success = async (message: string) => {
  await base(message, "success")
}
const error = async (message: string) => {
  await base(message, "error")
}
const base = async (message: string, cssClass: string, duration: number = 3000, position: 'top' | 'bottom' | 'middle' = 'bottom') => {
  const toast = await toastController.create({
    message: message,
    duration: duration,
    position: position,
    cssClass: cssClass
  });
  await toast.present();
}

export default { info, success, error }