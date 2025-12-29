/// <reference types="astro/client" />

interface RuntimeEnv {
    DB: D1Database;
}

declare namespace App {
    interface Locals {
        runtime: {
            env: RuntimeEnv;
        };
    }
}
