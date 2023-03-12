# アプリケーション名
tasks cultivator

# アプリケーション概要
平文。<br>
改行しました。

# URL
http://18.177.101.150/<br>
ID：edwin<br>
PASS：1947

# テスト用アカウント
- e-mail：test@test.com
- pass：1111iiii

# 利用方法
#### 下位項目
1. 順序
2. 順序②

# アプリケーションを作成した背景


##### 補足


# 洗い出した要件


# 実装した機能についての画像やGIFおよびその説明
- 項目
![画像の説明](https://gyazo.com/db272dfbde173ccfbebb443e72c1a8bd/raw)



# 実装予定の機能
- 項目①
- 項目②

# データベース設計

## users テーブル

| Column             | Type    | Options                    |
| ------------------ | ------- | -------------------------- |
| email              | string  | null: false, unique: true  |
| encrypted_password | string  | null: false                |
| nickname           | string  | null: false                |
| how_old_id         | integer | null: false                |
| sex_id             | integer | null: false                |
| introduction       | text    |                            |
| status_id          | integer | null: false, default: 1000 |



# 画面遷移図
![画面遷移図](https://gyazo.com/c195bddb9e31a5014bde4b6af57d1fd6/raw)

# 開発環境
#### ※Dockerをインストール済みであることを前提としています
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
DB_HOSTを次のように設定します
```
DB_HOST=mysql
```
BASIC認証の挙動を確認する場合は次のように設定します
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
