import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Returns `false` during SSR and the first hydration pass, then `true` on the
 * client. Uses `useSyncExternalStore` so it never calls `setState` inside an
 * effect — the React-recommended way to gate client-only rendering.
 */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
