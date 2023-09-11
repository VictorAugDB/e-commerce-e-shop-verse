import { Address } from '@/lib/db/mongodb/addresses'

type ListUserAddressesProps = {
  addresses: Address[]
  selectedAddress: Address | null
  setSelectedAddress: (address: Address | null) => void
}

export function ListUserAddresses({
  addresses,
  selectedAddress,
  setSelectedAddress,
}: ListUserAddressesProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-6 md:max-w-[28.1875rem]">
        <div>
          <h4 className="text-center md:text-start">Addresses</h4>
          <p className="font-medium">
            Select the address you want us to send the products
          </p>
        </div>
        {addresses.length &&
          addresses.map((a) => (
            <div key={a.id} className="space-y-2">
              <div
                onClick={() => setSelectedAddress(a)}
                data-selected={selectedAddress && selectedAddress.id === a.id}
                className="cursor-pointer space-y-1 rounded border border-gray-400 bg-white p-4 ring-green-700 data-[selected=true]:ring-2"
              >
                <p>CEP: {a.zipCode}</p>
                <p>
                  {a.city}, {a.street}, {a.number}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}
