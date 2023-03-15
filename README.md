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
#### 下位項目
1. 既存のアカウントを使用し、または新規アカウントを作成しログインする
2. 「プロジェクト」から、タスクを新規登録でき、期限が設定されたタスクはカレンダーにイベントが表示される
3. 登録されたタスクを展開(詳細表示)できる
4. 展開されたタスクは「編集」ボタンから編集フォームを開きタスクの内容を編集できる
5. 編集フォームの内容は、「更新」ボタンを押すことで反映される
6. タスク展開中は、当該タスクを含む列の右側の列の新規登録フォームから当該タスクを親とする子タスクを作成することができ、登録された子タスクはこの列に一覧で表示される
7. 上記3~6を再帰的に行うことができる
8. 完了したタスク・不要になったタスクで、DB上に子を持たないものは「完了・削除」ボタンでDB上から削除することができ、以降表示されなくなる

# アプリケーションを作成した背景
見通しを立てる事が難しいプロジェクトの遂行のためのタスク定義、管理において見出した課題として、タスクの粒度の問題がある。例えば、タスクAとタスクBを設定したが、タスクAをやっていく中で、実はタスクA-1とタスクA-2という2つのタスクとして捉えた方がより適切であるということがわかったとする。この時、タスクBと並列してタスクA-1とタスクA-2を新たに作成する方法がある。しかし、この方法では構造上タスクA-1とタスクA-2に連関関係を見出すことはできない。一方、新規タスク作成はせず、タスクAの詳細(説明)を更新する方法では、構造上のタスクとしては1つのため、個々の進捗管理が難しくなってしまう。いずれにせよ、その後タスクA-1も分割できることが分かり、分割されたタスクも更に…と細分化していくと、実行可能な(=適正な)タスクの粒度に対して構造の不整合が起きてしまう。

こうした課題を解決するために、タスクをツリー構造で管理することを考えた。ここで言うツリー構造とは、「親を持たない一つの要素が存在し、他の要素がただ一つの親を持つ」ようなデータ構造のことである*。ツリー構造によってタスク管理することで、常に構造における終端のタスクが適正な粒度であり、その単位において進捗管理ができ、なおかつタスク同士の連関を表現することができるようになる。

ツリー構造によるタスク管理において致命的な欠点となるのが、期日管理の難しさである。タスクの階層が深くなるにつれ、どのタスクにどれだけのタスクが紐づいており、それぞれの期日がいつなのかを把握することが難しくなってしまう(もし完璧に把握することができるのならそもそもタスク管理ツールは必要ない)。そこで、それぞれのタスクに期限となる日付を設定できるようにし、それらがひと目で分かるようカレンダーに表示されるようにした。

##### 補足
*アプリケーション、アプリケーションコードおよび本READMEでは、ツリー構造を持つタスク群について、親を持たないタスクを「プロジェクトタスク」、特定のタスクに対しての直接の親または(プロジェクトタスクを含む)子を持つタスク全般を「親タスク」、特定のタスクに対しての直接の子または親を持つタスク(プロジェクトタスク以外のタスク)全般を「子タスク」と呼ぶが、これらはタスクを管理するtasksテーブルにおいては等価である。


# 洗い出した要件
https://docs.google.com/spreadsheets/d/1j_OhzSkQo5UEQwoCwrh7HHS1flUOlkiP4rHf3KP8fLA/edit#gid=0

# 実装した機能についての画像やGIFおよびその説明
- 項目
![画像の説明](https://gyazo.com/db272dfbde173ccfbebb443e72c1a8bd/raw)



# 実装予定の機能
- 項目①
- 項目②

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
![画面遷移図](https://gyazo.com/c195bddb9e31a5014bde4b6af57d1fd6/raw)

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
#### タイトル

<!-- これでコメントアウト -->
