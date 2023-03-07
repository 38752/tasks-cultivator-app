import { closeATask, displayOrRemoveEditForm, updateTask, destroyTask, newTaskHtml, taskStore } from './task_functions';

document.addEventListener('DOMContentLoaded', () => {
  // 登録ボタンを取得
  const storeButtons = document.querySelectorAll('.btn-store');

  // なければ終わり
  if (storeButtons.length == 0) return null;

  // イベントをセット
  storeButtons.forEach(storeButton => {
    taskStore(storeButton);
  });
});
