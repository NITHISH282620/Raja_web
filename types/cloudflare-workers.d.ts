/**
 * `cloudflare:workers` exists only inside the Workers runtime.
 *
 * lib/storage/r2.ts imports it dynamically inside a try/catch so that Node
 * builds keep working; this declaration is what stops the compiler failing on
 * a module it cannot resolve on the build machine.
 */
declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}
