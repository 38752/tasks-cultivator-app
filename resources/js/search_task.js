// 日付を'yyyy年mm月dd日'にする関数
function formatDateForIndex(dt) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y + ' 年' + m + '月' + d+ '日');
}

function constructTBody(tasks) {
  let html = ``;
  tasks.forEach(task => {
    const startDate = (task.start_date == null) ? '' : new Date(task.start_date);
    const startDateForIndex =  (startDate == '') ? 'なし' : formatDateForIndex(startDate);
    html +=  `
            <tr>
                <td>
                    ${task.title}
                </td>
                <td class="candidate-detail">
                    ${task.detail}
                </td>
                <td>
                    ${startDateForIndex}
                </td>
                <td>
                    <a href="/tasks?selected_task=${task.id}" class="text-muted">
                        <i class="fas fa-search"></i>
                    </a>
                </td>
            </tr>`;
  });
  return html;
}

function searchTask(searchButton) {
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    // url作成
    const searchTerm = document.querySelector('input[name="adminlteSearch"]').value;
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const url = `/tasks/search?_token=${token}&adminlteSearch=${searchTerm}`;

    const XHR = new XMLHttpRequest();
    XHR.open("GET", url, true);
    XHR.responseType = "json";
    XHR.send(null);
    XHR.onload = () => {
      const response = XHR.response;
      const tasks = response.tasks;
      if (XHR.status === 422) {
        // 検索語句が空だった時
        alert(`${response.error}：${response.error_message}`);
        return null;
      }else if (XHR.status != 200) {
        // その他レスポンスに失敗した時
        alert(`Response Error ${XHR.status}: ${XHR.statusText}`);
        return null;
      };
      const CandidateTBody = document.querySelector('#candidate-tbody');
      CandidateTBody.innerHTML = constructTBody(tasks);
      const candidateCard = document.querySelector('#candidate-card');
      candidateCard.setAttribute('style', 'display: block;');
    };
  });
}

window.addEventListener('load', () => {
    // 検索フォームを取得
    const searchButton = document.querySelectorAll('button[class="btn btn-navbar"]')[0];

    // なければ終わり
    if (!searchButton) return null;
  
    // イベントをセット
    searchTask(searchButton);

    // ✖️ボタンにもイベントをセット
    const crossButton = document.querySelector('button[data-widget="navbar-search"]');
    crossButton.addEventListener('click', () => {
      const candidateCard = document.querySelector('#candidate-card');
      candidateCard.setAttribute('style', 'display: none;');
    });
});
