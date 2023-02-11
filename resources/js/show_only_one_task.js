// あるタスクが開かれたら、既に開かれているタスクは閉じる
document.addEventListener('DOMContentLoaded', () => {
  // ツールボタンを取得
  const taskBtnTools = document.querySelectorAll('.task-btn-tool');

  // なければ終わり
  if (taskBtnTools.length == 0) return null;

  taskBtnTools.forEach(taskBtnTool => {
    import('./task_functions.js').then(module => {
      var f = new module.TaskFunctions();
      f.closeATask(taskBtnTool);
    });
  });
});
