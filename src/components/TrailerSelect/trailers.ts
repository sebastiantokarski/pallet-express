export const TRAILERS = {
  bus8ep: { label: 'Bus 8EP', width: 220, length: 430, height: 220 },
  bus10ep: { label: 'Bus 10EP', width: 220, length: 490, height: 220 },
  bus12ep: { label: 'Bus 12EP', width: 245, length: 490, height: 230 },
  standard: { label: 'Naczepa Standard', width: 245, length: 1360, height: 280 },
  mega: { label: 'Naczepa Mega', width: 245, length: 1360, height: 300 },
  shipContainer20: { label: 'Kontener Morski 20', width: 244, length: 590, height: 239 },
  shipContainer40: { label: 'Kontener Morski 40', width: 235, length: 1203, height: 239 },
};

export type TrailerKey = keyof typeof TRAILERS;
