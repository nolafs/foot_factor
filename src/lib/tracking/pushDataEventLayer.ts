type DataLayerPayload = Record<string, unknown> & {
  event: string;
};

export function pushDataLayerEvent(payload: DataLayerPayload) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}
