import prisma from '@/db'

const countrySeed = async () => {
  try {
    const countries = [
      {
        name: 'Pakistan',
        iso3: 'PAK',
        iso2: 'PK',
        numeric_code: '586',
        phonecode: '92',
        emoji: '🇵🇰',
        emojiU: 'U+1F1F5 U+1F1F0'
      }
    ]

    for (const country of countries) {
      await prisma.countries.upsert({
        where: { phonecode: country.phonecode },
        update: {
          iso3: country.iso3,
          iso2: country.iso2,
          numeric_code: country.numeric_code,
          emoji: country.emoji,
          emojiU: country.emojiU,
          name: country.name
        },
        create: {
          name: country.name,
          iso3: country.iso3,
          iso2: country.iso2,
          numeric_code: country.numeric_code,
          phonecode: country.phonecode,
          emoji: country.emoji,
          emojiU: country.emojiU
        }
      })
    }

    console.info('Countries seeded successfully.')
  } catch (error) {
    console.error('Error seeding countries:', error)
    throw error
  }
}

export default countrySeed
