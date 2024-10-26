import soundFile from '../../assets/notification.mp3'
import add_money from '../../assets/add_money.wav'
import withdrawal from '../../assets/withdrawal.wav'
export const BattleNotificationSound = () =>{
    const audio = new Audio(soundFile);
  return  audio.play()
}
export const AddMoneyNotificationSound = () =>{
    const audio = new Audio(add_money);
  return  audio.play()
}
export const WithdrawalNotificationSound = () =>{
    const audio = new Audio(withdrawal);
  return  audio.play()
}