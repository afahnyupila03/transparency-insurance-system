import Zone from "../../models/zone.js";
import { Zones } from "./zones.js";

const seedZones = async () => {
    try {
        console.log('MongoDB connected. Seeding zones...')

        await Zone.deleteMany({})
        await Zone.insertMany(Zones)

    console.log('✅ zones seeded successfully.')
  } catch (error) {
    console.error('❌ Seeding zones failed:', error)
  }
}

export default seedZones