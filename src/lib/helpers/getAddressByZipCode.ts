import { faker } from '@faker-js/faker'

// TODO integrate with an api that do this
export async function getAddressByZipCode(
  zipCode: string,
): Promise<{ city: string; street: string }> {
  const _ = zipCode
  return new Promise((resolve) =>
    resolve({
      street: faker.location.streetAddress(),
      city: faker.location.city(),
    }),
  )
}
