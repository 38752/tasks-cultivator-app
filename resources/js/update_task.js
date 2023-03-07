import { updateTask } from './task_functions';

document.addEventListener('DOMContentLoaded', () => {
  // 更新ボタンを取得
  const updateButtons = document.querySelectorAll('.btn-update');

  // なければ終わり
  if (updateButtons.length == 0) return null;

  // イベントをセット
  updateButtons.forEach(updateButton => {
      updateTask(updateButton);
  });
});
