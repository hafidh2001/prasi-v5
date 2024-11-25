import { Readable } from "node:stream";
import { spawn as bunSpawn } from "bun";

export const spawn = (arg: {
  cmd: string;
  cwd: string;
  log?: false | { max_lines: number };
  onMessage?: (arg: {
    from: "stdout" | "stderr";
    text: string;
    raw: string;
  }) => void;
}) => {
  const log = {
    lines: 0,
    text: [] as string[],
  };

  async function processStream(
    stream: AsyncIterable<Buffer>,
    from: "stderr" | "stdout"
  ) {
    for await (const x of stream) {
      const buf = x as Buffer;
      const raw = buf.toString("utf-8");
      const text = raw
        .trim()
        .replace(
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
          ""
        );

      if (arg.log) {
        log.lines += 1;
        log.text.push(text);
        if (log.lines > arg.log.max_lines) {
          log.text.shift();
        }
      }

      if (arg.onMessage) {
        arg.onMessage({ from: from, text, raw });
      }
    }
  }

  const proc = bunSpawn({
    cmd: arg.cmd.split(" "),
    cwd: arg.cwd,
    stderr: "pipe",
    stdout: "pipe",
    env: { ...process.env, FORCE_COLOR: "1" },
  });
  const stdout = Readable.fromWeb(proc.stdout as any);
  const stderr = Readable.fromWeb(proc.stderr as any);

  return {
    subprocess: proc,
    exited: Promise.all([
      processStream(stdout, "stdout"),
      processStream(stderr, "stderr"),
    ]),
  };
};
