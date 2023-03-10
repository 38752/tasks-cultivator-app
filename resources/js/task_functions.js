// 関数ごとにエクスポート

export function closeATask(taskBtnTool) {
  // show_only_one_task.js
  // forEachの中身(開いているタスクを閉じる)

  const taskId = taskBtnTool.dataset.taskId;
  const taskDepth = Number(taskBtnTool.dataset.depth);

  taskBtnTool.addEventListener('click', () => {
    // コンディションをopenかclosedに切り替え
    if (taskBtnTool.dataset.condition === 'closed') {
      taskBtnTool.setAttribute('data-condition', 'open');
    } else {
      taskBtnTool.setAttribute('data-condition', 'closed');
    }

    // 同じ階層の表示を整える
    let taskCardBodies = document.querySelectorAll(`.column-only-tasks .card-body[data-depth="${taskDepth}"]`);
    taskCardBodies.forEach(taskCardBody => {
      if (taskCardBody.dataset.taskId != taskId){
        // 全体を整形
        // taskCardBody.parentElement.setAttribute('class', 'card card-outline card-success collapsed-card');
        taskCardBody.parentElement.classList.add("collapsed-card");
        // 出ている要素を畳む
        taskCardBody.setAttribute('style', 'display: none;');
        // アイコンを戻す
        taskCardBody.parentElement.children[0].children[1]
          .children[0].children[0].setAttribute('class', 'fas fa-plus');
        // クローズされたタスクのコンディションをclosedに切り替え
        taskCardBody.parentElement.children[0].children[1]
          .children[0].setAttribute('data-condition', 'closed');
      };
    });
  });
};


export function editChildTasksColumns(taskBtnTool) {
  const taskDepth = Number(taskBtnTool.dataset.depth);
  const parentTaskId = Number(taskBtnTool.dataset.taskId);

  taskBtnTool.addEventListener('click', () => {
    const childTasksColumns = document.querySelectorAll(`.tasks-column`);
    childTasksColumns.forEach(childTasksColumn => {
      // 階層の深いタスク列を削除
      if (taskDepth < childTasksColumn.dataset.depth) {
        childTasksColumn.remove();
      };
    });

    // タスクが開かれたなら子タスクの列を表示
    if (taskBtnTool.dataset.condition === 'open') {
      // XHRで子を配列で取得
      const XHR = new XMLHttpRequest();
      const url = `/tasks/${parentTaskId}/child_tasks`;
      XHR.open("GET", url, true);
      XHR.responseType = "json";
      XHR.send();
      XHR.onload = () => {
        // htmlを用意
        const html =`
          <div class="col-4 tasks-column" data-depth="${taskDepth + 1}" data-parent-task-id=${taskBtnTool.dataset.taskId}>
            <div class="column-only-tasks" data-depth="${taskDepth + 1}" data-parent-task-id=${taskBtnTool.dataset.taskId}>
            </div>
            <div class="col-md new-form-area" data-depth="${taskDepth + 1}">
              <div class="card card-outline card-primary collapsed-card" data-depth="${taskDepth + 1}">
                  <div class="card-header">
                      <h3 class="card-title">新規登録</h3>
                      <div class="card-tools">
                          <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-plus"></i>
                          </button>
                      </div>
                  </div>
                  <div class="card-body" style="display: none;">
                      <form action="/tasks" method="post" data-depth="${taskDepth + 1}">
                          <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]').getAttribute('content')}">
                              <div class="form-group">
                                  <label for="title">タイトル</label>
                                  <input type="text" class="form-control" id="title" name="title"
                                      placeholder="タスク名" />
                              </div>
                              <div class="form-group">
                                  <label for="detail">詳細</label>
                                  <textarea name="detail" id="detail" cols="30" rows="1.5"
                                      placeholder="詳細" class="form-control form-text-area"></textarea>
                              </div>
                              <div class="form-group">
                                  <label for="start_date">期限</label>
                                  <input type="date" class="form-control" id="start_date" name="start_date"
                                  />
                              </div>
                              <div class="row">
                                  <div class="ml-auto">
                                      <button type="submit" class="btn btn-primary btn-task btn-store" data-depth="${taskDepth + 1}">登録</button>
                                  </div>
                              </div>
                      </form>
                  </div>
              </div>
            </div>
          </div>
        `;
        // 並べる
        childTasksColumns[0].parentElement.insertAdjacentHTML('beforeend', html);

        // 新規登録ボタンを取得
        const storeButtons = document.querySelectorAll('.btn-store');
        if (storeButtons.length == 0) return null;
        const storeButton = storeButtons[storeButtons.length - 1];
        // 新規登録ボタンにイベントをセット
        taskStore(storeButton);

        // レスポンスに失敗したら子タスクは表示させない
        if (XHR.status != 200) {
          // レスポンスに失敗した時
          alert(`Response Error ${XHR.status}: ${XHR.statusText}`);
          return null;
        };

        // 子タスクを順に挿入
        const childTasks = XHR.response.childTasks;

        // 差し込みエリアを取得
        const insertArea = document.querySelector(`.column-only-tasks[data-depth="${taskDepth + 1}"]`);

        // 順に差し込み&イベントをセット
        childTasks.forEach(childTask => {
          insertArea.insertAdjacentHTML('beforeend', newTaskHtml(childTask, taskDepth + 1));
          buildNewTask(childTask);
        });
      };
    };
  });
};

// edit_task.js
// forEachの中身
export function displayOrRemoveEditForm(editButton) {
  // ボタンにイベントをセット
  editButton.addEventListener('click', () => {
    // idの一致するフォームを探す
    const taskId = editButton.dataset.taskId;
    const editForm = document.querySelector(`.edit-form[data-task-id="${taskId}"]`);

    // blockなら非表示、noneなら表示
    const status = editForm.getAttribute('style');
    if (status == 'display: block;') {
      editForm.setAttribute('style', 'display: none;');
    } else {
      editForm.setAttribute('style', 'display: block;');
    };
  });
};

// store_task.js
export function taskStore(storeButton) {
  storeButton.addEventListener('click', (e) => {
    e.preventDefault();
    const form = storeButton.parentElement.parentElement.parentElement;
    const formData = new FormData(form);

    // タスクidをurlに乗せて送信
    const newTaskDepth = Number(storeButton.dataset.depth);
    const parentTaskId = (newTaskDepth > 1) ? document.querySelector(`div[class="col-4 tasks-column"][data-depth="${newTaskDepth}"]`).dataset.parentTaskId : '0';
    const url = `/tasks?parent_task_id=${parentTaskId}`;

    const XHR = new XMLHttpRequest();
    XHR.open("POST", url, true);
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
      const depth = XHR.response.selfRelation.depth;
      const formArea = document.querySelector(`.new-form-area[data-depth="${depth}"]`);
      form.reset();

      // 作成したタスクを差し込み
      const task = XHR.response.success.task;

      // 差し込みエリアを取得、差し込み
      const insertArea = document.querySelector(`.column-only-tasks[data-depth="${depth}"]`);
      insertArea.insertAdjacentHTML('beforeend', newTaskHtml(task, depth));

      buildNewTask(task);
    };
  });
};

// update_task.js
export function updateTask(updateButton) {
  updateButton.addEventListener('click', (e) => {
    e.preventDefault();
    const taskId = updateButton.dataset.taskId;
    const form = updateButton.parentElement.parentElement.parentElement;
    const formData = new FormData(form);
    const XHR = new XMLHttpRequest();
    XHR.open("POST", `/tasks/${taskId}`, true);
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

      // フォームを非表示にする
      form.setAttribute('style', "display: none;");

      // 各項目を入れ直す
      const task = XHR.response.success.task;

      // taskIdを取得
      const taskId = task.id;

      // 日付を'yyyy年mm月dd日'にする
      if (task.start_date == null) {
        var startDate = 'なし';
      } else {
        var recordStartDate = new Date(task.start_date);
        var y = recordStartDate.getFullYear();
        var m = ('00' + (recordStartDate.getMonth()+1)).slice(-2);
        var d = ('00' + recordStartDate.getDate()).slice(-2);
        var startDate = (y + ' 年' + m + '月' + d+ '日');
      };

      // 各値をセット
      document.querySelector(`.task-title-container[data-task-id="${taskId}"]`).textContent = task.title;
      document.querySelector(`.task-detail-container[data-task-id="${taskId}"]`).innerHTML = `${task.detail.split('\n').join('<br />')}`;
      document.querySelector(`.task-start_date-container[data-task-id="${taskId}"]`).textContent = startDate;

      return null;
    };
  });
}

// delete_task.js
export function destroyTask(deleteButton) {
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    const taskId = deleteButton.dataset.taskId;
    const form = deleteButton.parentElement;
    const formData = new FormData(form);
    // 先にXHR送ってだめだったら終わり、
    // OKだったら「削除してもよろしいですか？」
    // →またXHR送る
    const preXHR =  new XMLHttpRequest();
    preXHR.open("GET", `/tasks/${taskId}/pre_destroy`, true);
    preXHR.responseType = "json";
    preXHR.send(formData);
    preXHR.onload = () => {
      if (preXHR.status === 422) {
        // ユーザーが違う時
        let errors = preXHR.response.errors;
        for (let key in errors) {
          alert(`${preXHR.response.statusText}: ${errors[key][0]}`);
        };
        return null;
      }else if (preXHR.status != 200) {
        // その他レスポンスに失敗した時
        alert(`Response Error ${preXHR.status}: ${preXHR.statusText}`);
        return null;
      };

      if (confirm('削除してもよろしいですか?')) {
        const XHR = new XMLHttpRequest();
        XHR.open("POST", `/tasks/${taskId}`, true);
        XHR.responseType = "json";
        XHR.send(formData);
        XHR.onload = () => {
          if (XHR.status === 422) {
            // ユーザーが違う時
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

          // タスクを削除
          const taskUnit = document.querySelector(`.task-unit[data-task-id="${taskId}"]`);
          taskUnit.remove();
  
          // 子階層を削除
          const taskDepth = Number(deleteButton.dataset.depth);
          const childTasksColumns = document.querySelectorAll(`.tasks-column`);
          childTasksColumns.forEach(childTasksColumn => {
            // 階層の深いタスク列を削除
            if (taskDepth < childTasksColumn.dataset.depth) {
              childTasksColumn.remove();
            };
          });
          return null;
  
        };
      } else {
        return null
      };
    };
  });
};

// 日付関連
// 日付を'yyyy年mm月dd日'にする関数
export function formatDateForIndex(dt) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y + ' 年' + m + '月' + d+ '日');
}

// 日付を'yyyy-mm-dd'にする関数
export function formatDateForForm(dt) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y + '-' + m + '-' + d);
}

// 新たに表示するtask
export function newTaskHtml(task, depth) {

  const startDate = (task.start_date == null) ? '' : new Date(task.start_date);
  const startDateForIndex =  (startDate == '') ? 'なし' : formatDateForIndex(startDate);
  const startDateForForm = (startDate == '') ? '' : formatDateForForm(startDate);

  const html = `
    <div class="col-md task-unit" data-depth="${depth}" data-task-id="${task.id}">
        <div class="card card-outline card-success collapsed-card" data-depth="${depth}" data-task-id="${task.id}">
            <div class="card-header">
                <h3 class="card-title">
                    <span class="task-title-container" data-task-id="${task.id}">${task.title}</span>
                </h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool task-btn-tool" data-card-widget="collapse" data-depth="${depth}" data-task-id="${task.id}" data-condition="closed">
                      <i class="fas fa-plus" data-task-id="${task.id}"></i>
                    </button>
                </div>
            </div>
            <div class="card-body existing-task-body" style="display: none;" data-depth="${depth}" data-task-id="${task.id}">
                <div class="item-group">
                    <span class="item-name">詳細</span>
                    <span class="task-detail-container" data-task-id="${task.id}">${task.detail.split('\n').join('<br />')}</span>
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
                        <form action="/tasks/${task.id}" method="post" class="delete-form">
                          <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]').getAttribute('content')}">
                          <input type="hidden" name="_method" value="DELETE">
                              <button type="submit" class="btn btn-info btn-sm btn-task btn-delete" data-depth="${depth}" data-task-id="${task.id}"
                                  >完了・削除</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="card-body" style="display: none;" data-depth="${depth}" data-task-id="${task.id}">
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

export function buildNewTask(task, depth) {
    // 各種イベントをセット
    // show_only_one_task.js
    const taskBtnTool = document.querySelector(`.task-btn-tool[data-task-id="${task.id}"]`);
    closeATask(taskBtnTool);
    editChildTasksColumns(taskBtnTool);
    // edit_task.js
    const editButton = document.querySelector(`.btn-edit[data-task-id="${task.id}"]`);
    displayOrRemoveEditForm(editButton);
    // update_task.js
    const updateButton = document.querySelector(`.btn-update[data-task-id="${task.id}"]`)
    updateTask(updateButton);
    // delete_task.js
    const deleteButton = document.querySelector(`.btn-delete[data-task-id="${task.id}"]`)
    destroyTask(deleteButton);
};