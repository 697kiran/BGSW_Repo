import { run } from './trails.mjs';

const { status, text } = run(process.argv.slice(2));
(status === 0 ? process.stdout : process.stderr).write(`${text}\n`);
process.exitCode = status;
