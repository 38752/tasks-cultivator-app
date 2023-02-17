// 日付を'yyyy年mm月dd日'にする関数
function formatDateForIndex(dt) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y + ' 年' + m + '月' + d+ '日');
}

// 日付を'yyyy-mm-dd'にする関数
function formatDateForForm(dt) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y + '-' + m + '-' + d);
}

// 新たに表示するtask
function newTaskHtml(task, depth) {
  const startDate = (task.start_date == null) ? '' : new Date(task.start_date);
  const startDateForIndex =  (startDate == '') ? 'なし' : formatDateForIndex(startDate);
  const startDateForForm = (startDate == '') ? '' : formatDateForForm(startDate);
  task.detail = task.detail.replace('\n', '<br />');

  const html = `
    <div class="col-md task-unit" data-depth="${depth}" data-task-id="${task.id}">
        <div class="card card-outline card-success collapsed-card" data-depth="${depth}" data-task-id="${task.id}">
            <div class="card-header">
                <h3 class="card-title">
                    <span class="task-title-container" data-task-id="${task.id}">${task.title}</span>
                </h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool task-btn-tool" data-card-widget="collapse" data-task-id="${task.id}">
                      <i class="fas fa-plus" data-task-id="${task.id}"></i>
                    </button>
                </div>
            </div>
            <div class="card-body existing-task-body" style="display: none;" data-task-id="${task.id}">
                <div class="item-group">
                    <span class="item-name">詳細</span>
                    <span class="task-detail-container" data-task-id="${task.id}">${task.detail}</span>
                </div>
                <div class="item-group">
                    <span class="item-name">期限</span>
                    <span class="task-start_date-container" data-task-id="${task.id}">
                      ${startDateForIndex}
                    </span>
                </div>
                <div class="row">
                    <div class="ml-auto">
                        <button type="button" class="btn btn-secondary btn-sm btn-task btn-edit" data-task-id="${task.id}"
                            >編集</button>
                        <form action="/tasks/{{ $task->id }}" method="post" class="delete-form">
                        <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]').getAttribute('content')}">
                        <input type="hidden" name="_method" value="DELETE">
                            <button type="submit" class="btn btn-info btn-sm btn-task btn-delete" data-task-id="${task.id}"
                                >完了・削除</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="card-body" style="display: none;" data-task-id="${task.id}">
                <form action="/tasks/${task.id}" method="post" class="edit-form" data-task-id="${task.id}">
                    <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]').getAttribute('content')}">
                    <input type="hidden" name="_method" value="PATCH">
                    <div class="form-group">
                        <label for="title">タイトル</label>
                        <input type="text" class="form-control" id="title" name="title" value="${task.title}"
                            placeholder="タスク名" />
                    </div>
                    <div class="form-group">
                        <label for="detail">詳細</label>
                        <textarea name="detail" id="detail" cols="30" rows="1.5"
                            placeholder="詳細" class="form-control form-text-area">${task.detail}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="start_date">期限</label>
                        <input type="date" class="form-control" id="start_date" name="start_date"
                            value="${startDateForForm}"
                            />
                    </div>
                    <div class="row">
                        <div class="ml-auto">
                            <button type="submit" class="btn btn-primary btn-task btn-update" data-task-id="${task.id}">更新</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
  return html;
};

document.addEventListener('DOMContentLoaded', () => {
  // 登録ボタンを取得
  const storeButtons = document.querySelectorAll('.btn-store');

  // なければ終わり
  if (storeButtons.length == 0) return null;

  // イベントをセット
  storeButtons.forEach(storeButton => {
    storeButton.addEventListener('click', (e) => {
      e.preventDefault();
      const form = storeButton.parentElement.parentElement.parentElement;
      const formData = new FormData(form);
      const XHR = new XMLHttpRequest();
      XHR.open("POST", `/tasks`, true);
      XHR.responseType = "json";
      XHR.send(formData);
      XHR.onload = () => {
        if (XHR.status === 422) {
          // バリデーションで引っかかった時
          let errors = XHR.response.errors;
          for (let key in errors) {
            alert(`${XHR.response.statusText}: ${errors[key][0]}`);
          };
          return null;
        }else if (XHR.status != 200) {
          // その他レスポンスに失敗した時
          alert(`Response Error ${XHR.status}: ${XHR.statusText}`);
          return null;
        };

        // フォームを初期状態に戻す
        const depth = 1;
        const formArea = document.querySelector(`.new-form-area[data-depth="${depth}"]`);
        form.reset();

        // 作成したタスクを差し込み
        const insertArea = document.querySelector(`.column-only-tasks[data-depth="${depth}"]`);
        const task = XHR.response.success.task;

        // 要素を差し込み
        insertArea.insertAdjacentHTML('beforeend', newTaskHtml(task, depth));

        // 各種イベントをセット
        import('./task_functions.js').then(module => {
          var f = new module.TaskFunctions();
          // show_only_one_task.js
          const taskBtnTool = document.querySelector(`.task-btn-tool[data-task-id="${task.id}"]`);
          f.closeATask(taskBtnTool);
          // edit_task.js
          const editButton = document.querySelector(`.btn-edit[data-task-id="${task.id}"]`);
          f.displayOrRemoveEditForm(editButton);
          // update_task.js
          const updateButton = document.querySelector(`.btn-update[data-task-id="${task.id}"]`)
          f.updateTask(updateButton);
          // delete_task.js
          const deleteButton = document.querySelector(`.btn-delete[data-task-id="${task.id}"]`)
          f.destroyTask(deleteButton);
        });
      };
    });
  });
});
