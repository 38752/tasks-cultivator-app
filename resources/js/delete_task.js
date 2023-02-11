document.addEventListener('DOMContentLoaded', () => {
  // 削除ボタンを取得
  const deleteButtons = document.querySelectorAll('.btn-delete');

  // なければ終わり
  if (deleteButtons.length == 0) return null;

  // イベントをセット
  deleteButtons.forEach(deleteButton => {
    import('./task_functions.js').then(module => {
      var f = new module.TaskFunctions();
      f.destroyTask(deleteButton);
    });
  });
});