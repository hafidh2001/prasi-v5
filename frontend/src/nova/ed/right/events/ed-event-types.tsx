export const EdEventTypes = {
  "On Init": {
    vars: {},
    desc: "Dipanggil ketika pertama kali halaman dimuat.\nBiasanya digunakan untuk loading data dari server/database.",
  },
  "On Click": {
    vars: {},
    desc: "Dipanggil ketika item ini di klik",
  },
  "On Hover": {
    vars: {},
    desc: "Dipanggil ketika item ini di hover",
  },
  "On Leave": {
    vars: {},
    desc: "Dipanggil ketika item ini keluar dari hover",
  },
};

export type EventType = keyof typeof EdEventTypes;
