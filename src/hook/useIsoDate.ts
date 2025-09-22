// hooks/useIsoDate.ts
"use client";

import { useCallback } from "react";
import dayjs from "dayjs";

export function useIsoDate() {
  // Format a JS Date → ISO (YYYY-MM-DDT00:00:00.000Z)
  const formatAsIsoDate = useCallback((date: Date | null): string | null => {
    if (!date) return null;
    const d = dayjs(date);
    return `${d.format("YYYY-MM-DD")}T00:00:00.000Z`;
  }, []);

  return { formatAsIsoDate };
}
