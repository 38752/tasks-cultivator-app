window.addEventListener('DOMContentLoaded', () => {
  // カレンダー表示中はタスク検索させない
  const projectType = document.querySelector('meta[name="page-category"]').getAttribute('content');
  if (projectType != "individual-calendar") return null;

  document.querySelectorAll('.navbar-search-anchor')[0].children[1].children[0].setAttribute('style', 'visibility: hidden;');
});