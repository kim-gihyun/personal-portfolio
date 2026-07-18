"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** GoatCounter counts the initial page load itself (count.js `onload`). This
 *  records the client-side (soft) navigations Next does between routes, which
 *  the base script never sees — so sub-pages aren't undercounted. */
type GoatCounter = { count?: (opts: { path: string }) => void };

export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false; // the landing page is already counted by count.js
      return;
    }
    const gc = (window as unknown as { goatcounter?: GoatCounter }).goatcounter;
    gc?.count?.({ path: pathname });
  }, [pathname]);

  return null;
}
