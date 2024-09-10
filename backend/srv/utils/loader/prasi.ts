import { validate } from "uuid";
import { dir } from "../dir";
import { parseTypeDef } from "../parser/parse-type-def";
import { gzipAsync } from "../server/zlib";
import mime from "mime";
import { loadSite } from "./site";

export const prasiLoader = async ({
  pathname,
  site_id,
}: {
  pathname: string;
  site_id: string;
}) => {
  const action = pathname.split("/")[1];

  switch (action) {
    case "prisma.ext": {
      const path = dir.root(`backend/srv/templates/typings/prisma_ext_d_ts`);
      const file = Bun.file(path);
      return new Response(file);
    }
    case "type_def": {
      const path = dir.data(`/code/${site_id}/site/typings.d.ts`);
      const file = Bun.file(path);
      if (await file.exists()) {
        try {
          const res = JSON.stringify(await parseTypeDef(path));
          await Bun.write(
            dir.data(
              `/code/${site_id}/site/type_def.${file.lastModified}.json`
            ),
            res
          );

          return new Response(Bun.gzipSync(res), {
            headers: {
              "content-type": "application/json",
              "content-encoding": "gzip",
            },
          });
        } catch (e) {}
      }
      return new Response("{}", {
        headers: { "content-type": "application/json" },
      });
    }
    case "typings.d.ts": {
      const build_path = dir.data(`/code/${site_id}/site/typings.d.ts`);
      let file = Bun.file(build_path);

      if (await file.exists()) {
        const body = Bun.gzipSync(await file.arrayBuffer());

        return new Response(body, {
          headers: {
            "content-type": file.type,
            "content-encoding": "gzip",
          },
        });
      }
      return new Response("");
    }
    case "code": {
      const arr = pathname.split("/").slice(2);
      const codepath = arr.join("/");
      const build_path = dir.data(`code/${site_id}/site/build/${codepath}`);
      const build_old = dir.data(`code/${site_id}/site/build-old/${codepath}`);

      try {
        let file = Bun.file(build_path);

        return new Response(
          await gzipAsync(new Uint8Array(await file.arrayBuffer())),
          {
            headers: {
              "content-encoding": "gzip",
              "content-type": mime.getType(build_path) || "",
            },
          }
        );
      } catch (e) {
        try {
          let file = Bun.file(build_old);

          return new Response(
            await gzipAsync(new Uint8Array(await file.arrayBuffer())),
            {
              headers: {
                "content-encoding": "gzip",
                "content-type": mime.getType(build_path) || "",
              },
            }
          );
        } catch (e: any) {
          return new Response(
            `
console.error("Failed to load index.js")
console.error("${e.message}");
setTimeout(() =>{
location.reload();
}, 1500);
`,
            {
              headers: { "content-type": "application/javascript" },
            }
          );
        }
      }
    }
    case "route": {
      // if (!g.route_cache) g.route_cache = {};
      // if (g.route_cache[site_id]) {
      //   if (
      //     req.headers.get("accept-encoding")?.includes("br") &&
      //     g.route_cache[site_id].br
      //   ) {
      //     return new Response(g.route_cache[site_id].br, {
      //       headers: {
      //         "content-type": "application/json",
      //         "content-encoding": "br",
      //       },
      //     });
      //   }

      //   if (
      //     req.headers.get("accept-encoding")?.includes("gzip") &&
      //     g.route_cache[site_id].gzip
      //   ) {
      //     return new Response(g.route_cache[site_id].gzip, {
      //       headers: {
      //         "content-type": "application/json",
      //         "content-encoding": "gzip",
      //       },
      //     });
      //   }
      // }

      // const site = await _db.site.findFirst({
      //   where: { id: site_id },
      //   select: {
      //     id: true,
      //     name: true,
      //     domain: true,
      //     responsive: true,
      //     config: true,
      //   },
      // });

      // const layouts = await _db.page.findMany({
      //   where: {
      //     name: { startsWith: "layout:" },
      //     is_deleted: false,
      //     id_site: site_id,
      //   },
      //   select: {
      //     id: true,
      //     name: true,
      //     is_default_layout: true,
      //     content_tree: true,
      //   },
      // });

      // let layout = null as any;
      // for (const l of layouts) {
      //   if (!layout) layout = l;
      //   if (l.is_default_layout) layout = l;
      // }

      // let api_url = "";
      // if (site && site.config && (site.config as any).api_url) {
      //   api_url = (site.config as any).api_url;
      //   delete (site as any).config;
      // }
      // const urls = await _db.page.findMany({
      //   where: {
      //     id_site: site_id,
      //     is_default_layout: false,
      //     is_deleted: false,
      //   },
      //   select: { url: true, id: true },
      // });

      // if (!g.route_cache[site_id]) {
      //   g.route_cache[site_id] = {};
      // }

      // const res = JSON.stringify({
      //   site: { ...site, api_url },
      //   urls,
      //   layout: layout
      //     ? { id: layout.id, root: layout.content_tree }
      //     : undefined,
      // });

      // if (!g.br) {
      //   g.br = await brotliPromise;
      // }
      // setTimeout(() => {
      //   if (!g.route_cache_compressing) g.route_cache_compressing = new Set();
      //   if (g.route_cache_compressing.has(site_id)) return;
      //   g.route_cache_compressing.add(site_id);
      //   g.route_cache[site_id].br = g.br.compress(encoder.encode(res));
      //   g.route_cache_compressing.delete(site_id);
      // }, 100);

      // g.route_cache[site_id].gzip = await gzipAsync(res);

      // return new Response(g.route_cache[site_id].gzip, {
      //   headers: {
      //     "content-type": "application/json",
      //     "content-encoding": "gzip",
      //   },
      // });
      return new Response("");
    }
    case "page": {
      const page_id = pathname.split("/").pop() as string;
      if (validate(page_id)) {
        const page = await _db.page.findFirst({
          where: { id: page_id },
          select: { content_tree: true, url: true },
        });
        if (page) {
          // return await responseCompressed(
          //   req,
          //   JSON.stringify({
          //     id: page_id,
          //     root: page.content_tree,
          //     url: page.url,
          //   }) as any
          // );
        }
      }
      return null;
    }
    case "pages": {
      // const page_ids = req.params.ids as string[];
      // if (page_ids) {
      //   const ids = page_ids.filter((id) => validate(id));
      //   const pages = await _db.page.findMany({
      //     where: { id: { in: ids } },
      //     select: { id: true, content_tree: true, url: true },
      //   });
      //   if (pages) {
      //     return await responseCompressed(
      //       req,
      //       JSON.stringify(
      //         pages.map((e: any) => ({
      //           id: e.id,
      //           url: e.url,
      //           root: e.content_tree,
      //         }))
      //       ) as any
      //     );
      //   }
      // }
      break;
    }
    case "comp": {
      // const ids = req.params.ids as string[];
      // const result = {} as Record<string, any>;
      // if (Array.isArray(ids)) {
      //   const comps = await _db.component.findMany({
      //     where: { id: { in: ids } },
      //     select: { content_tree: true, id: true },
      //   });
      //   for (const comp of comps) {
      //     result[comp.id] = comp.content_tree;
      //   }
      // }
      // return await responseCompressed(req, JSON.stringify(result) as any);
    }
  }
  return new Response("action " + action + ": not found");
};
