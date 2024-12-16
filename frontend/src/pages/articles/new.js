// import mustache from 'mustache';
// Viteのルールとして、インポートする対象のファイルをそのまま取得するためには相対パスの末尾に"?raw"を付与する必要がある
// この場合、テンプレートのHTMLファイルをそのまま取得したいので"?raw"を末尾に付与している
// 参照: https://ja.vite.dev/guide/assets.html#importing-asset-as-string
// import html from '../../templates/articles/new.html?raw';


// 当授業ではCSRF攻撃に対して脆弱なコードとなっていますが、実装が煩雑になるので考慮せずに実装しますが
// 実際にログインを伴うサイト等でフォーム送信などを行う処理にはCSRF攻撃に対する対策CSRFトークンも含めるなどの対策を実施してください
// 参考: https://developer.mozilla.org/ja/docs/Glossary/CSRF

/**
 * 記事新規作成時の処理の関数
 */
// export const articlesNew = () => {
//   const app = document.querySelector('#app');
//   // templates/articles/new.html を <div id="app"></div> 要素内に出力する
//   app.innerHTML = mustache.render(html, {});

//   // TODO: new.htmlにかかれているHTMLに入力の変更があったら画面右側のプレビューの内容を入力した内容に応じたものに変換する
//   // 処理...

  // "公開" ボタンを押下された際にPOSTメソッドで /api/v1/articles に対してAPI通信を fetch で送信する
  import mustache from 'mustache';
  // Viteのルールとして、インポートする対象のファイルをそのまま取得するためには相対パスの末尾に"?raw"を付与する必要がある
  // この場合、テンプレートのHTMLファイルをそのまま取得したいので"?raw"を末尾に付与している
  // 参照: https://ja.vite.dev/guide/assets.html#importing-asset-as-string
  import { parse } from 'marked';
  import DOMPurify from 'dompurify';
  import html from '../../templates/articles/new.html?raw';
  
  // 当授業ではCSRF攻撃に対して脆弱なコードとなっていますが、実装が煩雑になるので考慮せずに実装しますが
  // 実際にログインを伴うサイト等でフォーム送信などを行う処理にはCSRF攻撃に対する対策CSRFトークンも含めるなどの対策を実施してください
  // 参考: https://developer.mozilla.org/ja/docs/Glossary/CSRF

  /**
 * 記事新規作成時の処理の関数
 */
  export const articlesNew = () => {
    const app = document.querySelector('#app');
  
    // Mustacheを使ってHTMLテンプレートをレンダリング
    app.innerHTML = mustache.render(html, {});
  
    const textarea = document.getElementById('editor-textarea');
    const previewArea = document.getElementById('preview-area');
    const form = document.getElementById('articles-new-form');
    const submitButton = form.querySelector('button[type="submit"]');
  
    // Markdown入力時にプレビューを更新
    textarea.addEventListener('input', function () {
      const markdownText = textarea.value;
  
      // 1. MarkdownをHTMLに変換（marked）
      const htmlContent = parse(markdownText);
  
      // 2. HTMLをDOMPurifyでサニタイズして安全にする
      const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  
      // 3. サニタイズしたHTMLをプレビューエリアに挿入
      previewArea.innerHTML = sanitizedHtml;
    });
  
    // フォーム送信時の処理
    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // フォームのデフォルト送信を防止
  
      const title = document.querySelector('input[name="title"]').value;
      const body = textarea.value;
  
      // API送信用データ
      const data = {
        title: title,
        body: body
      };
  
      try {
        // 1. POSTメソッドでAPIに送信
        const response = await fetch('/api/v1/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // JSONデータを送信
          },
          body: JSON.stringify(data) // JSON形式でデータを送信
        });
  
        // 2. レスポンスの処理
        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result);
  
          // 成功時: フォームをリセットして、プレビューを消去
          form.reset();
          previewArea.innerHTML = '';
          alert('記事が公開されました！');
        } else {
          // エラーハンドリング: APIからエラーが返ってきた場合
          const error = await response.json();
          console.error('Error:', error);
          alert('記事の公開に失敗しました。');
        }
      } catch (error) {
        // ネットワークエラーなどのハンドリング
        console.error('Network Error:', error);
        alert('通信エラーが発生しました。');
      }
    });
  };
  

