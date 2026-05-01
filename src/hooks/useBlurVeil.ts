import { useEffect, useRef } from "react";

/**
 * Tap-to-focus blur-veil controller.
 *
 * Attach the returned ref to a `.blur-veil` wrapper. On touch/click,
 * the tapped child item gets `.is-focused` and the wrapper gets
 * `.has-focused`, mirroring the desktop hover behaviour.
 * Tapping outside any item clears focus.
 */
export function useBlurVeil<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const clear = () => {
      el.classList.remove("has-focused");
      el.querySelectorAll(".blur-veil-item.is-focused").forEach((n) =>
        n.classList.remove("is-focused"),
      );
    };

    const onPointer = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const item = target.closest(".blur-veil-item") as HTMLElement | null;
      if (!item || !el.contains(item)) {
        clear();
        return;
      }
      // Toggle if same item already focused
      if (item.classList.contains("is-focused")) {
        clear();
        return;
      }
      clear();
      el.classList.add("has-focused");
      item.classList.add("is-focused");
    };

    const onDocClick = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) clear();
    };

    el.addEventListener("click", onPointer);
    document.addEventListener("click", onDocClick);
    return () => {
      el.removeEventListener("click", onPointer);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  return ref;
}
