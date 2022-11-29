import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

const listener = Deno.listen({ hostname: "localhost", port: 8000 });

for await (const conn of listener) {
  async () => {
    const requests = Deno.serveHttp(conn);
    for await (const { request, respondWith } of requests) {
      const response = await app.handle(request, conn);
      if (response) {
        respondWith(response);
      }
    }
  };
}
