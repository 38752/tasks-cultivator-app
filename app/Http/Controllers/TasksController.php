<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\TasksRelation;
use App\Http\Requests\TaskRequest;
use Illuminate\Support\Facades\Auth;

class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // 自分のtasksを取得
        $user = Auth::user();
        $project_ids = TasksRelation::query()
                        ->where('depth', '=', 1)
                        ->whereColumn('parent_task_id', '=', 'child_task_id')
                        ->pluck('parent_task_id')
                        ->toArray();
        $projects = Task::whereUserId($user->id)
                    ->whereIn('id', $project_ids)
                    ->get();
        $depth = 1;

        // selected_taskを取得
        if ($request->input('selected_task') != null) {
            $selected_task = $request->input('selected_task');
        } else {
            $selected_task = null;
        };

        return view(
            'task.index',
            ['user' => $user, 'projects' => $projects,
             'depth' => $depth, 'selected_task' => $selected_task]
        );
    }

    /**
     * 子タスクを配列で渡す
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getChildTasks($id)
    {
        $parent_task_depth = TasksRelation::query()
                                ->where('parent_task_id', '=', $id)
                                ->whereColumn('parent_task_id', '=', 'child_task_id')
                                ->first()
                                ->depth;
        $child_task_ids = TasksRelation::query()
                            ->where('parent_task_id', '=', $id)
                            ->where('depth', '=', $parent_task_depth)
                            ->whereColumn('parent_task_id', '!=', 'child_task_id')
                            ->pluck('child_task_id')
                            ->toArray();
        $child_tasks = Task::query()
                        ->where('id', '=', $child_task_ids)
                        ->get();
        return response()->json(['childTasks' => $child_tasks]); //JSONデータをJavaScriptに渡す
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TaskRequest $request)
    {
        $task = new Task;

        // fillを使用する場合は、必ずモデルのfillableを指定する
        $task->fill($request->all());
        $task->save();

        $success = [
            'task' => $task,
        ];

        // 親タスクidを取得
        $parent_task_id = $request->input('parent_task_id');

        // 親タスクの紐づきを上の階層から順に拾う
        $parent_relations = TasksRelation::query()
        ->where('child_task_id', '=', $parent_task_id)
        ->orderBy('depth', 'asc')
        ->get();

        // 親idを元に自身に追加していく
        foreach($parent_relations as $parent_relation) {
            $tasks_relation = new TasksRelation;
            $tasks_relation->fill([
                'parent_task_id' => $parent_relation->parent_task_id,
                'child_task_id' => $task->id,
                'depth' => $parent_relation->depth,
            ])->save();
        };
        // 自身のidでも作成
        $tasks_relation = new TasksRelation;
        $tasks_relation->fill([
            'parent_task_id' => $task->id,
            'child_task_id' => $task->id,
            'depth' => ($parent_relations->count() + 1)
        ])->save();

        // 一覧へ戻り完了メッセージを表示
        return response()->json(['success' => $success, 'parentRelations' => $parent_relations, 'selfRelation' => $tasks_relation]); //JSONデータをJavaScriptに渡す
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TaskRequest $request, $id)
    {
        // taskを見つける
        $task = Task::find($id);

        // ユーザー認証
        $user = Auth::user();
        if ($task->user_id != $user->id) {
            $response['statusText']  = 'Unauthorized Error';
            $response['errors']  = ['user' => ['The user must not be different from the registrant.']];
            return response()->json( $response, 422 );
        };

        // fillを使用する場合は、必ずモデルのfillableを指定する
        $task->fill($request->all());
        $task->update();

        $success = [
            'task' => $task,
        ];

        // 一覧へ戻り完了メッセージを表示
        return response()->json(['success' => $success]); //JSONデータをJavaScriptに渡す
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // taskを見つける
        $task = Task::find($id);

        // ユーザー認証
        $user = Auth::user();
        if ($task->user_id != $user->id) {
            $response['statusText']  = 'Unauthorized Error';
            $response['errors']  = ['user' => ['The user must not be different from the registrant.']];
            return response()->json( $response, 422 );
        };

                // 子があるか検証
        $task_relations = TasksRelation::query()
                            ->where('parent_task_id', '=', $id)
                            ->get();
        $task_relations_count = $task_relations->count();
        if ($task_relations_count > 1) {
            $response['statusText']  = 'Consistency Error';
            $response['errors']  = ['Undeletable task' => ['It is unable to delete tasks having children.']];
            return response()->json( $response, 422 );
        }

        // 削除
        $task->delete();

        // 関係も削除
        foreach ($task_relations as $task_relation) {
            $task_relation->delete();
        }

        $success = [
            'task' => $task,
        ];

        return response()->json(['success' => $success]); //JSONデータをJavaScriptに渡す
    }

    /**
     * Confirm if it is able to remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function preDestroy($id)
    {
        // taskを見つける
        $task = Task::find($id);

        // ユーザー認証
        $user = Auth::user();
        if ($task->user_id != $user->id) {
            $response['statusText']  = 'Authorization Error';
            $response['errors']  = ['user' => ['The user must not be different from the registrant.']];
            return response()->json( $response, 422 );
        };

        // 子があるか検証
        $task_relations = TasksRelation::query()
                            ->where('parent_task_id', '=', $id)
                            ->get();
        $task_relations_count = $task_relations->count();
        if ($task_relations_count > 1) {
            $response['statusText']  = 'integrity Error';
            $response['errors']  = ['Undeletable task' => ['It is unable to delete tasks having children.']];
            return response()->json( $response, 422 );
        }

        $success = [
            'task' => $task,
        ];

        return response()->json(['success' => $success]); //JSONデータをJavaScriptに渡す
    }

    /**
     * 該当するタスクを配列で渡す
     *
     * @param  Request  $request
     */
    public function searchTasks(Request $request)
    {
        // 検索語句取得
        $searchTerm = $request->input('adminlteSearch');

        // ユーザーを取得
        $user = Auth::user();

        // 正規表現で拾う
        $tasks = Task::query()
                    ->whereUserId($user->id)
                    ->where('title', 'LIKE', "%{$searchTerm}%")
                    ->get();


        if ($request->input('adminlteSearch') == null) {
            // 検索語句がnullなら422で返す
            $response['error'] = 'Invalid Request';
            $response['error_message'] = 'type a search term.';
            return response()->json($response, 422);
        };
        if ($tasks->count() == 0) {
            // $tasksが空なら422で返す
            $response['error'] = 'No Data';
            $response['error_message'] = 'There were no applicable projects.';
            return response()->json($response, 422);
        };

        // jsonで返す
        return response()->json(['tasks' => $tasks]);
    }

    /**
     * イベントを取得
     *
     * @param  Request  $request
     */
    public function getTasks(Request $request)
    {
        // ユーザーを取得
        $user = Auth::user();

        // バリデーション
        $request->validate([
            'start_date' => 'required|integer',
            'end_date' => 'required|integer'
        ]);

        // カレンダー表示期間
        $start_date = date('Y-m-d', $request->input('start_date') / 1000);
        $end_date = date('Y-m-d', $request->input('end_date') / 1000);

        // 取得処理
        return Task::query()
        ->select(
                // FullCalendarの形式に合わせる
                'start_date as start',
                'end_date as end',
                'title as title'
            )
            // FullCalendarの表示範囲のみ表示
            ->whereUserId($user->id)
            ->where('end_date', '>=', $start_date)
            ->where('start_date', '<=', $end_date)
            ->get(); 
    }
}
