import { createFileRoute, redirect } from "@tanstack/react-router";

// Catch-all for anything the route tree doesn't match — typos, stale links,
// malformed paths. Sending people home beats a dead end.
export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => null,
});
