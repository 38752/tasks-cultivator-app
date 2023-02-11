// import '@fullcalendar/core/vdom'; // for Vite
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    var calendarEl = document.getElementById("calendar");
    if (!calendarEl) return null;

    let calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, listPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listMonth",
        },
        locale: "ja",
        editable: true,
    
        events: function (info, successCallback, failureCallback) {
            axios
                .post("/tasks-get", {
                    start_date: info.start.valueOf(),
                    end_date: info.end.valueOf(),
                })
                .then((response) => {
                    // 追加したイベントを削除
                    calendar.removeAllEvents();
                    // カレンダーに読み込み
                    successCallback(response.data);
                    calendar.render();
                })
                .catch(() => {
                    // バリデーションエラーなど
                    alert("登録に失敗しました");
                });
        },
    });
  });
