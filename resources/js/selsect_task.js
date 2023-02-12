window.addEventListener('load', () => {
  // selected_taskを取得
  const taskId = document.querySelector('#selected-task-id-container').dataset.selectedTaskId;

  // 空なら終わり
  if (taskId == '') return null;


  // タスクのツールボタンを探す
  const taskButtonTool = document.querySelector(`.task-btn-tool[data-task-id="${taskId}"]`);

  // なければ終わり
  if (!taskButtonTool) return null;

  // ツールボタンをクリック
  taskButtonTool.click();

});
