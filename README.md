# アプリケーション名
tasks cultivator

# アプリケーション概要
タスク管理アプリ。特に、見通しを立てる事が難しいプロジェクトにおけるタスク管理を目的としている。
あるタスクに対して複数の子を紐づけることができ、(相対的)親タスクを通して子タスクを操作することができる。
また、期限となる日付を設定したタスクは、カレンダー上の設定された日にタスクのタイトル(タスクを管理するtasksテーブルのtitleカラムに保存された値)が表示される。

# URL
http://18.177.101.150/<br>
ID：edwin<br>
PASS：1947

# テスト用アカウント
- e-mail：test@test.com
- pass：1111iiii

# 利用方法
1. 既存のアカウントを使用し、または新規アカウントを作成しログインする
2. 「プロジェクト」から、タスクを新規登録でき、期限が設定されたタスクはカレンダーにイベントが表示される
3. 登録されたタスクを展開(詳細表示)できる
4. 展開されたタスクは「編集」ボタンから編集フォームを開きタスクの内容を編集できる
5. 編集フォームの内容は、「更新」ボタンを押すことで反映される
6. タスク展開中は、当該タスクを含む列の右側の列の新規登録フォームから当該タスクを親とする子タスクを作成することができ、登録された子タスクはこの列に一覧で表示される
7. 上記3~6を再帰的に行うことができる
8. 完了したタスク・不要になったタスクで、子を持たないものは「完了・削除」ボタンでDB上から削除することができ、以降表示されなくなる

# アプリケーションを作成した背景
見通しを立てる事が難しいプロジェクトの遂行のためのタスク定義、管理において見出した課題として、タスクの粒度の問題がある。例えば、タスクAとタスクBを設定したが、タスクAをやっていく中で、実はタスクA-1とタスクA-2という2つのタスクとして捉えた方がより適切であるということがわかったとする。この時、2つのタスク管理方法が考えられる。一つは、タスクBと並列してタスクA-1とタスクA-2を新たに作成する方法だが、この方法では構造上タスクA-1とタスクA-2に連関関係を見出すことはできない。一方、新規タスク作成はせず、タスクAの詳細(説明)を更新する方法では、登録されているタスクとしては1つのため、個々の進捗管理が難しくなってしまう。いずれにせよ、その後タスクA-1も分割できることが分かり、分割されたタスクも更に…と細分化していくと、実行可能な(=適正な)タスクの粒度に対して構造の不整合が起きてしまう。

こうした課題を解決するために、タスクをツリー構造で管理することを考えた。ここで言うツリー構造とは、「親を持たない一つの要素が存在し、他の要素がただ一つの親を持つ」ようなデータ構造のことである*。ツリー構造によってタスク管理することで、常に構造における終端のタスクが適正な粒度であり、その単位において進捗管理ができ、なおかつタスク同士の連関を表現することができるようになる。

ツリー構造によるタスク管理において致命的な欠点となるのが、期日管理の難しさである。タスクの階層が深くなるにつれ、どのタスクにどれだけのタスクが紐づいており、それぞれの期日がいつなのかを把握することが難しくなってしまう(もし完璧に把握することができるのならそもそもタスク管理ツールは必要ない)。そこで、それぞれのタスクに期限となる日付を設定できるようにし、それらがひと目で分かるようカレンダーに表示されるようにした。

##### 補足
*アプリケーション、アプリケーションコードおよび本READMEでは、ツリー構造を持つタスク群について、親を持たないタスクを「プロジェクトタスク」、特定のタスクに対しての直接の親または(プロジェクトタスクを含む)子を持つタスク全般を「親タスク」、特定のタスクに対しての直接の子または親を持つタスク(プロジェクトタスク以外のタスク)全般を「子タスク」と呼ぶが、これらはタスクを管理するtasksテーブルにおいては等価である。


# 洗い出した要件
https://docs.google.com/spreadsheets/d/1j_OhzSkQo5UEQwoCwrh7HHS1flUOlkiP4rHf3KP8fLA/edit#gid=0

# 実装した機能についての画像やGIFおよびその説明
- 新規登録できる
![新規登録](https://gyazo.com/e445385d02b1ef7b3de9739d1cdbc385/raw)

- ログインできる
![ログイン](https://gyazo.com/590b61c7baf417892fcd53adc924887d/raw)

- タスクを登録できる(プロジェクトタスク)
![プロジェクトタスク登録](https://gyazo.com/2092f2ac17ed1b15ed19ad57295e03c2/raw)

- タスクを登録できる(子タスク)
![子タスク登録](https://gyazo.com/7a8bdfa3d322a18264de55447442e3f1/raw)

- タスクを排他的に展開する
![排他的展開](https://gyazo.com/0fe3e0bcd09268986bb27a12601b4c17/raw)

- タスクを編集・更新できる
![タスク編集・更新](https://gyazo.com/fdb3c024be87fe8998f9f46e1528fd02/raw)

- タスクを削除できる
![タスク削除](https://gyazo.com/06cbcb254e402b1621c9cfe1d1dbceea/raw)

- タスクを検索できる
![タスク検索](https://gyazo.com/3f9224c436e362be1ab449ac9234ee97/raw)

- 検索結果のタスクを選択すると展開された状態で表示できる
![タスク選択](https://gyazo.com/d80b56b484eeb72b03fcd0f2def7c6af/raw)

- 期限を設定したタスクはカレンダーに表示される
![カレンダー表示](https://gyazo.com/88175874a67eb0745da29ad0f2f45211/raw)


# 実装予定の機能・仕様
- 「完了」アクションと「削除」アクションの分割
    - 「完了」の場合はDB上でタスクを削除せず、編集できない状態にする
    - 「削除」の場合はDBから当該のレコードを削除する
- タスクの完了率を表示する機能
- タスクの列が削除された際に表示がカクカクしないようにする修正

# データベース設計

## users テーブル(Laravel Breeze使用)

| Column             | Type    | Options                    |
| ------------------ | ------- | -------------------------- |
| name               | string  |                            |
| email              | string  | unique()                   |
| password           | string  |                            |


## tasks テーブル

| Column             | Type    | Options                    |
| ------------------ | ------- | -------------------------- |
| user_id            | integer | nullable(false)            |
| title              | string  | nullable(false)            |
| detail             | text    | nullable(false)            |
| start_date         | date    | nullable()                 |
| end_date           | date    | nullable()                 |


## tasks_relations テーブル

| Column             | Type    | Options                    |
| ------------------ | ------- | -------------------------- |
| parent_task_id     | integer | nullable(false)            |
| child_task_id      | integer | nullable(false)            |
| depth              | integer | nullable(false)            |


# 画面遷移図
![画面遷移図](https://gyazo.com/7ba9049a6348bdb30c8abd16bdff2857/raw)

# 開発環境
- フレームワーク
  - Laravel Framework 9.50.2
- タスク管理
  - GitHub
- テキストエディタ
  - Visual Studio Code
- 使用言語
  - HTML
  - CSS
  - JavaScript
  - PHP 8.2.3
- デプロイ
  - AWS/EC2
  - AWS/RDS(mySQL)

# ローカルでの動作方法
#### ※Dockerがインストール済みであることを前提としています
##### git cloneする(ターミナルで実行)
ターミナルで次のコマンドを実行
```
git clone https://github.com/38752/tasks-cultivator-app.git
```
##### プロジェクトディレクトリに移動
ターミナルで次のコマンドを実行
```
cd tasks-cultivator-app
```
##### Composerのパッケージをインストール
ターミナルで次のコマンドを実行
```
docker run --rm -u "$(id -u):$(id -g)" -v $(pwd):/var/www/html -w /var/www/html laravelsail/php82-composer:latest composer install --ignore-platform-reqs
```
##### Sailをバックグラウンドで起動
ターミナルで次のコマンドを実行
```
./vendor/bin/sail up -d
```
##### プロジェクト直下に.envファイルを作成し、環境変数を設定
既に存在する.env.exampleファイルの名前を.envへ変更し使用しても構いません
##### .envファイルを編集
DB_HOSTを次のように設定
```
DB_HOST=mysql
```
BASIC認証の挙動を確認する場合は次のように設定
```
BASIC_AUTH_ID="<ユーザー名>"
BASIC_AUTH_PASS="<パスワード>"
```
##### 環境変数APP_KEYを設定
```
sail php artisan key:generate
```
##### マイグレート
```
sail php artisan migrate
```
##### npmをインストール
```
sail npm install
```
##### viteを起動
```
sail npm run dev
```
##### localhostにアクセス
```
http://localhost/
```

#### 停止させる場合
##### viteを停止
ターミナル上でcontrol + C
##### Sailのコンテナを停止
```
./vendor/bin/sail down
```


# 工夫したポイント、苦労した点
#### タスクや関連するツリー構造のデータの読み書きを画面遷移なしで実装した
本アプリケーションで設定した課題を解決するには、データベース上でツリー構造を表現するだけでなく、ユーザーがそうした構造を感覚的に掴めるようにする必要がある。本アプリケーションでは、展開されたタスクとその右側にある子タスクの列という位置関係によってこれを実現しているが、目まぐるしい画面遷移によってユーザーの体験を損なわないために、プロジェクト管理ページにおいては一切画面遷移を行わず、表示の変更を全てJavaScriptを用いて描画するようにした。

関数定義(切り分け)の問題からコードを大幅に変更したほか、リクエストに意図したパラメータが乗らないなど苦労した部分が多かったが、結果としてタスクに関する全てのDOMオブジェクトを(bladeに依らず)JavaScriptで一元的に管理できるようになり、保守性が向上した。


#### タスク削除前の挙動をよりユーザーがストレスなく操作できるようにした
タスク周りのデータの読み書きは、全て画面遷移を伴わずに行われる。この際、不正なリクエストや何らかのエラーに対してはエラーメッセージがダイアログボックスのアラートで表示される。タスク削除においては、データの整合性を保つため、リクエストを送ったユーザーが削除対象のタスクを作成したユーザーと一致しており、かつ削除対象のタスクに子タスクが存在しないということを確認した上で削除が実行される。また、タスク削除は不可逆的な処理のため、処理の前にダイアログボックスを用いて確認し、「OK」「キャンセル」の内「OK」が選択された場合のみ削除する仕様になっている。

この仕様の実装方法として、確認ダイアログで「OK」を選択した場合のみリクエストを送信する方法では、送信するリクエストは一度で済む一方、タスクが削除に必要な条件を満たさなかった場合、『「完了・削除」ボタンを押す→確認ダイアログで「OK」を選択する→エラーメッセージが表示される』という、確認を求められた挙句拒否されるという二度手間の体験を与えてしまうことになる。

そこで、削除アクション(destroy)とは別に削除可能かを判定するアクション(preDestroy)を用意し、「完了・削除」ボタンを押した時点で削除可能かどうかを判定するためだけにリクエストを送信、この時点で条件を満たさない場合はエラーメッセージを表示し、条件を満たす場合のみ確認ダイアログを表示させ、確認ダイアログで「OK」が選択された場合のみ削除アクションが実行されるというフローを採り、ユーザーのストレスを減らすよう工夫した。意図しない方法でユーザーが直接削除アクションの実行をリクエストした場合に備えて、削除アクション自体にも条件を満たしているかの判定を行わせ、満たさない場合はエラーメッセージが表示されるようになっている。

<!-- これでコメントアウト -->
