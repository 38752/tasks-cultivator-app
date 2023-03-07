window.addEventListener('load', () => {
  // 要素を取得
  const taskIdContainer = document.querySelector('#selected-task-id-container');

  // なければ終わり
  if (!taskIdContainer) return null;

  // selected_taskを取得
  const taskId = taskIdContainer.dataset.selectedTaskId;

  // 空なら終わり
  if (taskId == '') return null;


  // タスクのツールボタンを探す
  const taskButtonTool = document.querySelector(`.task-btn-tool[data-task-id="${taskId}"]`);

  // なければ終わり
  if (!taskButtonTool) return null;

  // ツールボタンをクリック
  taskButtonTool.click();

});
