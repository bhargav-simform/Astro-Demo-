import type { MiddlewareHandler } from "astro";

const middleware: MiddlewareHandler = (context, next) => {
    if(context.request.url.endsWith("/protected")) {
        return new Response("Access Denied", { status: 403 });
    }

    return next();
};

export const onRequest = middleware;