// 編集が押されたら、編集フォームを開いたり閉じたりする
document.addEventListener('DOMContentLoaded', () => {
  // 編集ボタンを取得
  const editButtons = document.querySelectorAll('.btn-edit');

  // なければ終わり
  if (editButtons.length == 0) return null;

  editButtons.forEach(editButton => {
    import('./task_functions.js').then(module => {
      var f = new module.TaskFunctions();
      f.displayOrRemoveEditForm(editButton);
    });
  });
});
