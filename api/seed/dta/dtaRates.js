const CAT = {
  1: '1X',
  2: '2X',
  3: '3X'
}

const rates = [
  {
    hpRange: { min: 2, max: 7 },
    price: 30000,
    type: CAT[1]
  },
  {
    hpRange: { min: 8, max: 13 },
    price: 50000,
    type: CAT[1]
  },
  {
    hpRange: { min: 14, max: 20 },
    price: 75000,
    type: CAT[1]
  },
  {
    hpRange: { min: 21, max: Infinity },
    price: 200000,
    type: CAT[1]
  }
]

export default rates
