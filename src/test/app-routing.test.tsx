import { QueryClient } from "@tanstack/react-query";
import {
  createRouter,
  isRedirect,
  rootRouteId,
  type Redirect,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { Route as CatchAllRoute } from "@/routes/$";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const makeRouter = () =>
  createRouter({ routeTree, context: { queryClient: new QueryClient() } });

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const matches = makeRouter().matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("serves / from the home page, not the catch-all", () => {
    expect(makeRouter().matchRoutes("/").at(-1)?.routeId).not.toBe("/$");
  });

  it("routes unknown paths to the catch-all instead of the not-found boundary", () => {
    const router = makeRouter();

    for (const path of ["/totally-unknown", "/a/b/c", "/a/b/c?q=1"]) {
      expect(router.matchRoutes(path).at(-1)?.routeId).toBe("/$");
    }
  });

  it("redirects the catch-all to the home page", () => {
    const beforeLoad = CatchAllRoute.options.beforeLoad as unknown as () => void;

    let thrown: unknown;
    try {
      beforeLoad();
    } catch (error) {
      thrown = error;
    }

    expect(isRedirect(thrown)).toBe(true);
    expect((thrown as Redirect).options.to).toBe("/");
  });
});
