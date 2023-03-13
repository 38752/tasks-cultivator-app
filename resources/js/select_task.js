import { drawTasks } from './task_functions';

window.addEventListener('DOMContentLoaded', () => {
  // 展開適用範囲かを確認し、"individual-projects"でなければ終わり
  const projectType = document.querySelector('meta[name="page-category"]').getAttribute('content');
  if (projectType != "individual-projects") return null;

  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const url = `/tasks/construct?_token=${token}&selected_task_id=""`;

  drawTasks(url);
});
