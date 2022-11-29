/*
function Deno.writeFile(
    path: string | URL, 
    data: Uint8Array, 
    options?: Deno.WriteFileOptions | undefined
): Promise<void>

Write data to the given path, by default creating 
a new file if needed, else overwriting. */

/*
Requires allow-write permission, and allow-read if options.create is false.
@tags - allow-read, allow-write  */

const text = "This should be store in a file again";
const encoder = new TextEncoder();
const data = encoder.encode(text);

await Deno.writeFile("hello1.txt", data); // overwrite "hello1.txt" or create it
await Deno.writeFile("hello2.txt", data, { create: false, append: true }); // only works if "hello2.txt" exists
await Deno.writeFile("hello3.txt", data, { mode: 0o777 }); // set permissions on new file
await Deno.writeFile("hello4.txt", data, { append: true }); // add data to the end of the file

Deno.writeFile("message-max.txt", data).then(() =>
  console.log("Written to file"),
);
