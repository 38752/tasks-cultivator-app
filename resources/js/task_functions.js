// タスク関連の関数をまとめるクラス
export class TaskFunctions {
  // show_only_one_task.js
  // forEachの中身
  closeATask(taskBtnTool) {
    const taskId = taskBtnTool.dataset.taskId;
    taskBtnTool.addEventListener('click', () => {

      // 同じ階層の表示を整える
      let taskCardBodies = document.querySelectorAll(`.column-only-tasks .card-body`);
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
        };
      });
    });
  };

  // edit_task.js
  // forEachの中身
  displayOrRemoveEditForm(editButton) {
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

  // update_task.js
  updateTask(updateButton) {
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
  destroyTask(deleteButton) {
    deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('削除してもよろしいですか?')) {
        const taskId = deleteButton.dataset.taskId;
        const XHR = new XMLHttpRequest();
        const form = deleteButton.parentElement;
        const formData = new FormData(form);
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
          return null;
        };
      } else {
        return null
      };
    });
  };
}

