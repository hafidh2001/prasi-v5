import { dir } from "../dir";
import { parse } from "node-html-parser";

export const prodIndex = async (
  site_id: string,
  prasi: { page_id?: string; params?: any }
) => {
  let head: string[] = [];
  const index_file = Bun.file(dir.root(`/frontend/prod/index.html`));
  if (await index_file.exists()) {
    const index = await index_file.text();
    const html = parse(index);
    head = [
      ...html.querySelectorAll("script").map((e) => {
        return e.toString();
      }),
      ...html.querySelectorAll("link").map((e) => {
        return e.toString();
      }),
    ];
  }

  return {
    head,
    body: [] as string[],
    render() {
      return `\
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, user-scalable=1.0, minimum-scale=1.0, maximum-scale=1.0">
  ${this.head.join("\n")}
</head>

<body class="flex-col flex-1 w-full min-h-screen flex opacity-0">
  ${this.body.join("\n")}
  <div id="root"></div>
  <script>
    window._prasi = { 
      basepath: "/prod/${site_id}", 
      site_id: "${site_id}",${
        prasi.page_id ? `\n      page_id: "${prasi.page_id}",` : ""
      }${
        typeof prasi.params === "object"
          ? `\n      params: ${JSON.stringify(prasi.params)},`
          : ""
      }
    }
  </script>
</body>

</html>`;
    },
  };
};
