export default function emailModel(
  paragrafos: string[],
  email: string
): string {
  const ssl = process.env.ENABLE_SSL === "true" ? "https://" : "http://";
  const host = ssl + process.env.HOST;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="https://www.w3.org/1999/xhtml">
      <head>
        <title>Notificação Ambientech</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            margin: 0;
            font-family: "Roboto", sans-serif;
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
            color: #333;
            background-color: #fff;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          #img {
            width: 25%;
            margin: auto;
          }
          #img img {
            width: 100%;
            padding: 0 8px;
            background: #006ffe;
          }
          #tiny {
            text-align: center;
            color: gray;
            font-size: x-small;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div id="img">
            <img
              src="${host}/images/email.png"
              alt="Ambientech"
            />
          </div>
          <h4>Olá! Ambientech notifica que...</h4>
          ${paragrafos.map((p) => `<p>${p}</p>`).join("\n")}
          <p>Atenciosamente,<br />Equipe Ambientech</p>
          <hr />
          <div id="tiny">
            <p>Este e-mail foi enviado de um endereço que apenas envia notificações e não pode receber e-mails.</p>
            <p>Não responda a esta mensagem.</p>
            <p>Se não desejar receber mais emails <a href="${host}/unsubscribe/${email}">clique aqui!</a></p>
            <p>Ambientech ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
    </html>`;
}
