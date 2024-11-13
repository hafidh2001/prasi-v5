import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/comp_img/:comp_id",
  api: async ({ req, params }: ServerCtx) => {
    if (req.method === "POST" && req.body) {
      const body = await req.blob();
      const comp = await _db.component_ext.findFirst({
        where: { id_component: params.comp_id },
        select: { id: true },
      });
      if (comp) {
        await _db.component_ext.update({
          where: { id: comp.id },
          data: {
            img: Buffer.from(await body.arrayBuffer()),
          },
        });
      } else {
        await _db.component_ext.create({
          data: {
            id_component: params.comp_id,
            img: Buffer.from(await body.arrayBuffer()),
          },
        });
      }
    } else if (req.method === "GET") {
      const comp = await _db.component_ext.findFirst({
        where: { id_component: params.comp_id },
        select: { img: true },
      });
      if (comp && comp.img) {
        return new Response(comp.img, {
          headers: {
            "Content-Type": "image/png",
          },
        });
      } else {
        const byteArray = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
        const buffer = Buffer.from(byteArray);
        return new Response(buffer, {
          headers: {
            "Content-Type": "image/png",
          },
        });
      }
    }
    return new Response("ok");
  },
};
