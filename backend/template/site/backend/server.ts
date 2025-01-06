export const server: PrasiServer = {
  http({ handle, req }) {
    return handle(req);
  },
};
