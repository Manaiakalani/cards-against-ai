"use client";

import { useEffect } from "react";

const ALLOWED_HOSTNAMES = ["manaiakalani.github.io"];

export function Analytics() {
  useEffect(() => {
    if (!ALLOWED_HOSTNAMES.includes(window.location.hostname)) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://analytics.manaiakalani.info/api/script.js";
    script.defer = true;
    script.setAttribute("data-site-id", "c9d271d42b7f");
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return null;
}
