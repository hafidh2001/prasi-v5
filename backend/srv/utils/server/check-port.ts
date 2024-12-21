export const waitPort = (port: number, arg?: { onPortUsed: () => void }) => {
  let is_connecting = false;
  const portAvailable = () => {
    return new Promise<boolean>(async (done) => {
      try {
        const conn = await Bun.connect({
          port,
          hostname: "localhost",
          socket: {
            data(socket, data) {}, // message received from client
            open(socket) {
              done(false);
              conn.end();
            }, // socket opened
            close(socket) {}, // socket closed
            drain(socket) {}, // socket ready for more data
            error(socket, error) {
              done(true);
            }, // error handler
          },
        });
        if (conn.readyState === "open") {
          conn.end();
          done(false);
        }
      } catch (e) {
        done(true);
      }
    });
  };
  return new Promise<void>(async (done) => {
    if (!(await portAvailable())) {
      if (arg?.onPortUsed) {
        arg.onPortUsed();
      }

      const ival = setInterval(async () => {
        if (!is_connecting) {
          is_connecting = true;
          if (await portAvailable()) {
            clearInterval(ival);
            done();
          }
          is_connecting = false;
        }
      }, 500);
    }
    done();
  });
};
