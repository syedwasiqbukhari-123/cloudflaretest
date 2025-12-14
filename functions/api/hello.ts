interface Env {
    // Define bindings here
}

export const onRequest: PagesFunction<Env> = async (context) => {
    return new Response(JSON.stringify({ message: "Hello from Cloudflare Functions!" }), {
        headers: { "Content-Type": "application/json" },
    });
};
