'use client';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { useEventConfigStore } from '../stores/event-config-store';
import { useMapStore } from '../stores/map-store';

/** Dev-only: connect Reticle + install the React adapter, after hydration. */
export function ReticleDev() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    void import('@reticlehq/react').then(({ reticle, install, registerCapabilities, registerStore }) => {
      install();
      // Both provided by withReticle() in next.config. The bridge rejects a connect with no token;
      // the root makes source paths repo-relative instead of absolute.
      const token = process.env.NEXT_PUBLIC_RETICLE_TOKEN;
      const root = process.env.NEXT_PUBLIC_RETICLE_ROOT;
      reticle.connect({ projectId: 'web-8a7fcf31', ...(token ? { token } : {}), ...(root ? { root } : {}) });

      // ── Start with ONE flow. ──────────────────────────────────────────────────────────────────
      // Registering a store is the highest-value line here: it lets the agent check what the app
      // BELIEVES, not just what it rendered. Pass the STORE, not `() => store.getState()` — the store
      // form wires `subscribe` too, so every mutation emits a diff; the getter form is read-only.
      registerStore('auth', useAuthStore);
      registerStore('event-config', useEventConfigStore);
      registerStore('map', useMapStore);
      registerCapabilities({
        testids: [], // none found; add data-testid to your key elements
        signals: [], // names you pass to reticle.signal()
        stores: ['auth', 'event-config', 'map'], // the keys you registered above
      });
    });
  }, []);
  return null;
}
