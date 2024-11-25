export const setupDevPort = () => {
  process.on("message", (msg: any) => {
    if (!g.rsbuild) {
      g.rsbuild = { prasi_port: 0, site_port: 0 };
    }
    if (msg.site_port) {
      g.rsbuild.site_port = msg.site_port;
    }
    if (msg.prasi_port) {
      g.rsbuild.prasi_port = msg.prasi_port;
    }
  });
  process.send?.({ resend_port: true });
};
