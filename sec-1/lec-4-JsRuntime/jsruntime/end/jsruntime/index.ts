import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile("./read.txt", { encoding: "utf-8" });
console.log(input);
const data = new Uint8Array(Buffer.from("Hello World"));
await fs.writeFile("./write.txt", data);

console.log(path.basename(import.meta.path));
console.log(path.dirname(import.meta.path));
console.log(path.extname(import.meta.file));
console.log(path.join(import.meta.dir, "next", "another"));

const response = await fetch("https://jsonplaceholder.typicode.com/posts");
console.log(await response.json());
