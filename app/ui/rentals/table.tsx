import { UpdateRental, DeleteRental } from '@/app/ui/rentals/buttons';
import { fetchFilteredRentals } from '@/app/lib/rentals/data';
import { fetchCustomerById } from '@/app/lib/customers/data';
import { fetchVehicleById } from '@/app/lib/vehicles/data';
import { formatCurrencyGb, formatDateToLocal } from '@/app/lib/utils';


// Componente assíncrono para renderizar o nome do cliente
async function CustomerName({ customerId }: { customerId: string }) {
  const customer = await fetchCustomerById(customerId);
  return <span>{customer ? customer.name : 'Cliente não encontrado'}</span>;
}

async function VehicleName({ vehicleId }: { vehicleId: string }) {
  const vehicle = await fetchVehicleById(vehicleId);
  return <span>{vehicle ? vehicle.make + " " + vehicle.model : 'Veículo não encontrado'}</span>;
}

async function VehicleStatus({ vehicleId }: {vehicleId: string}) {
  const vehicle = await fetchVehicleById(vehicleId);
  const status = vehicle ? vehicle.status : 'Veículo não encontrado';
  const statusClass = status === 'rented' ? 'text-red-500' : 'text-green-500';
  return <span className={statusClass}>{status}</span>;
}

export default async function RentalsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const rentals = await fetchFilteredRentals(query, currentPage);

  async function getCustomerName(id: string) {
    const customer = await fetchCustomerById(id);
    return customer ? customer.name : 'Cliente não encontrado';
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {rentals?.map((rental) => (
              <div
                key={rental.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <CustomerName customerId={rental.customerId} />
                    </div>
                    <div className="mb-2 flex items-center">
                      <VehicleName vehicleId={rental.vehicleId} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{formatCurrencyGb(rental.total)}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{rental.startDate.toISOString()}</p>
                    <p>{rental.endDate ? rental.endDate.toISOString() : "No end date available"}</p>

                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateRental id={rental.id} />
                    <DeleteRental id={rental.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Vehicle
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Payment
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rentals?.map((rental) => (
                <tr
                  key={rental.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <CustomerName customerId={rental.customerId} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <VehicleName vehicleId={rental.vehicleId} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <VehicleStatus vehicleId={rental.vehicleId}/>
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-3">
                    {rental.daypayment}
                  </td> */}
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateRental id={rental.id} />
                      <DeleteRental id={rental.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}