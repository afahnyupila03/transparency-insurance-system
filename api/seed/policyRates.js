const ENERGY = {
  E: 'ESSENCE',
  D: 'DIESEL'
}

const CAT = {
  1: '1X',
  2: '2X',
  3: '3X'
}

const ZONE = {
  A: 'A',
  B: 'B',
  C: 'C'
}

const zoneARates = [
  // Zone A with Ess n no-trailer.
  {
    zone: ZONE.A,
    energy: ENERGY.E,
    hpRange: { min: 0, max: 2 },
    type: CAT[1],
    withTrailer: false,
    price: 52499
  },
  {
    zone: ZONE.A,
    energy: ENERGY.E,
    hpRange: { min: 3, max: 6 },
    type: CAT[1],
    withTrailer: false,
    price: 63784
  },
  {
    zone: ZONE.A,
    energy: ENERGY.E,
    hpRange: { min: 7, max: 10 },
    type: CAT[1],
    withTrailer: false,
    price: 70877
  },
  {
    zone: ZONE.A,
    energy: ENERGY.E,
    hpRange: { min: 11, max: 14 },
    type: CAT[1],
    withTrailer: false,
    price: 92497
  },
  {
    zone: ZONE.A,
    energy: ENERGY.E,
    hpRange: { min: 15, max: 23 },
    type: CAT[1],
    withTrailer: false,
    price: 117764
  },
  {
    zone: ZONE.A,
    energy: ENERGY.E,
    hpRange: { min: 24, max: Infinity },
    type: CAT[1],
    withTrailer: false,
    price: 138863
  },
  {
    zone: ZONE.A,
    energy: ENERGY.D,
    hpRange: { min: 0, max: 1 },
    type: CAT[1],
    withTrailer: false,
    price: 52499
  },
  {
    zone: ZONE.A,
    energy: ENERGY.D,
    hpRange: { min: 2, max: 4 },
    type: CAT[1],
    withTrailer: false,
    price: 63784
  },
  {
    zone: ZONE.A,
    energy: ENERGY.D,
    hpRange: { min: 5, max: 7 },
    type: CAT[1],
    withTrailer: false,
    price: 70877
  },
  {
    zone: ZONE.A,
    energy: ENERGY.D,
    hpRange: { min: 8, max: 10 },
    type: CAT[1],
    withTrailer: false,
    price: 92497
  },
  {
    zone: ZONE.A,
    energy: ENERGY.D,
    hpRange: { min: 11, max: 16 },
    type: CAT[1],
    withTrailer: false,
    price: 117764
  },
  {
    zone: ZONE.A,
    energy: ENERGY.D,
    hpRange: { min: 17, max: Infinity },
    type: CAT[1],
    withTrailer: false,
    price: 13883
  }
]

const zoneBRates = [
  {
    zone: ZONE.B,
    energy: ENERGY.E,
    hpRange: { min: 0, max: 2 },
    type: CAT[1],
    withTrailer: false,
    price: 50311
  },
  {
    zone: ZONE.B,
    energy: ENERGY.E,
    hpRange: { min: 3, max: 6 },
    type: CAT[1],
    withTrailer: false,
    price: 61126
  },
  {
    zone: ZONE.B,
    energy: ENERGY.E,
    hpRange: { min: 7, max: 10 },
    type: CAT[1],
    withTrailer: false,
    price: 67924
  },
  {
    zone: ZONE.B,
    energy: ENERGY.E,
    hpRange: { min: 11, max: 14 },
    type: CAT[1],
    withTrailer: false,
    price: 88643
  },
  {
    zone: ZONE.B,
    energy: ENERGY.E,
    hpRange: { min: 15, max: 23 },
    type: CAT[1],
    withTrailer: false,
    price: 112858
  },
  {
    zone: ZONE.B,
    energy: ENERGY.E,
    hpRange: { min: 24, max: Infinity },
    type: CAT[1],
    withTrailer: false,
    price: 133077
  },
  {
    zone: ZONE.B,
    energy: ENERGY.D,
    hpRange: { min: 0, max: 1 },
    type: CAT[1],
    withTrailer: false,
    price: 50311
  },
  {
    zone: ZONE.B,
    energy: ENERGY.D,
    hpRange: { min: 2, max: 4 },
    type: CAT[1],
    withTrailer: false,
    price: 61126
  },
  {
    zone: ZONE.B,
    energy: ENERGY.D,
    hpRange: { min: 5, max: 7 },
    type: CAT[1],
    withTrailer: false,
    price: 67924
  },
  {
    zone: ZONE.B,
    energy: ENERGY.D,
    hpRange: { min: 8, max: 10 },
    type: CAT[1],
    withTrailer: false,
    price: 88643
  },
  {
    zone: ZONE.B,
    energy: ENERGY.D,
    hpRange: { min: 11, max: 16 },
    type: CAT[1],
    withTrailer: false,
    price: 112858
  },
  {
    zone: ZONE.B,
    energy: ENERGY.D,
    hpRange: { min: 17, max: Infinity },
    type: CAT[1],
    withTrailer: false,
    price: 133077
  }
]

const zoneCRates = [
  {
    zone: ZONE.C,
    energy: ENERGY.E,
    hpRange: { min: 0, max: 2 },
    type: CAT[1],
    withTrailer: false,
    price: 48124
  },
  {
    zone: ZONE.C,
    energy: ENERGY.E,
    hpRange: { min: 3, max: 6 },
    type: CAT[1],
    withTrailer: false,
    price: 58468
  },
  {
    zone: ZONE.C,
    energy: ENERGY.E,
    hpRange: { min: 7, max: 10 },
    type: CAT[1],
    withTrailer: false,
    price: 64970
  },
  {
    zone: ZONE.C,
    energy: ENERGY.E,
    hpRange: { min: 11, max: 14 },
    type: CAT[1],
    withTrailer: false,
    price: 84789
  },
  {
    zone: ZONE.C,
    energy: ENERGY.E,
    hpRange: { min: 15, max: 23 },
    type: CAT[1],
    withTrailer: false,
    price: 107951
  },
  {
    zone: ZONE.C,
    energy: ENERGY.E,
    hpRange: { min: 24, max: Infinity },
    type: CAT[1],
    withTrailer: false,
    price: 127291
  },
  {
    zone: ZONE.C,
    energy: ENERGY.D,
    hpRange: { min: 0, max: 1 },
    type: CAT[1],
    withTrailer: false,
    price: 48124
  },
  {
    zone: ZONE.C,
    energy: ENERGY.D,
    hpRange: { min: 2, max: 4 },
    type: CAT[1],
    withTrailer: false,
    price: 58468
  },
  {
    zone: ZONE.C,
    energy: ENERGY.D,
    hpRange: { min: 5, max: 7 },
    type: CAT[1],
    withTrailer: false,
    price: 64970
  },
  {
    zone: ZONE.C,
    energy: ENERGY.D,
    hpRange: { min: 8, max: 10 },
    type: CAT[1],
    withTrailer: false,
    price: 84789
  },
  {
    zone: ZONE.C,
    energy: ENERGY.D,
    hpRange: { min: 11, max: 16 },
    type: CAT[1],
    withTrailer: false,
    price: 107951
  },
  {
    zone: ZONE.C,
    energy: ENERGY.D,
    hpRange: { min: 17, max: Infinity },
    type: CAT[1],
    withTrailer: false,
    price: 127291
  }
]

const policyRates = [...zoneARates, ...zoneBRates, ...zoneCRates]

export default policyRates
