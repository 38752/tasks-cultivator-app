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
- フレームワーク
  - Laravel
- タスク管理
  - GitHub
- テキストエディタ
  - Visual Studio Code
- 使用言語
  - HTML
  - CSS
  - JavaScript
  - PHP
- デプロイ
  - AWS/EC2
  - AWS/RDS(mySQL)

# ローカルでの動作方法
以下のコマンドを順に実行
```
git clone https://github.com/38752/pick_me_app
```
```
cd pick_me_app
```
```
bundle install
```
```
yarn install
```

# 工夫したポイント、苦労した点
#### タイトル

<!-- これでコメントアウト -->
