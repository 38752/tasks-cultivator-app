import { searchTasks } from './task_functions';

window.addEventListener('load', () => {
    // 検索フォームを取得
    const searchButton = document.querySelectorAll('button[class="btn btn-navbar"]')[0];

    // なければ終わり
    if (!searchButton) return null;
  
    // イベントをセット
    searchTasks(searchButton);

    // ✖️ボタンにもイベントをセット
    const crossButton = document.querySelector('button[data-widget="navbar-search"]');
    crossButton.addEventListener('click', () => {
      const candidateCard = document.querySelector('#candidate-card');
      candidateCard.setAttribute('style', 'display: none;');
    });
});
