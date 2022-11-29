/*
function Deno.write(
    rid: number, 
    data: Uint8Array
): Promise<number>

Write to the resource ID (rid) the contents of 
the array buffer (data).

Resolves to the number of bytes written. 
This function is one of the lowest level APIs and 
most users should not work with this directly, 
but rather use writeAll() from std/streams/conversion.ts instead.

It is not guaranteed that the full buffer will be 
written in a single call. */

const encoder = new TextEncoder();
const data = encoder.encode("Hello world");
const file = await Deno.open("/foo/bar.txt", { write: true });
await Deno.write(file.rid, data); // 11
Deno.close(file.rid);

/* @category - I/O */
