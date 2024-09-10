export const apiDefinition = [
  await import("./api/_prasi"),
  await import("./api/_dbs"),
  await import("./api/_proxy"),
  await import("./api/prod"),
  await import("./api/site_load"),
];
