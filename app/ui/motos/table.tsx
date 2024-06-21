import { UpdateVehicle, DeleteVehicle } from '@/app/ui/motos/buttons';
import { fetchFilteredVehicles } from '@/app/lib/vehicles/data';
import { Vehicle } from '@/app/lib/vehicles/definitions';

export default async function VehiclesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const vehicles: Vehicle[] = await fetchFilteredVehicles(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {vehicles.map((vehicle: Vehicle) => (
              <div
                key={vehicle.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{vehicle.make} {vehicle.model}</p>
                    </div>
                    <p className="text-sm text-gray-500">{vehicle.plate}</p>
                  </div>
                  <p className="text-sm text-gray-500">{vehicle.status}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{vehicle.series}</p>
                    <p>{vehicle.engine_capacity}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateVehicle id={vehicle.id} />
                    <DeleteVehicle id={vehicle.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Plate
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Make
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Model
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  MOT
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {vehicles.map((vehicle: Vehicle) => (
                <tr
                  key={vehicle.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{vehicle.plate}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.make}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.model}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.mot || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.status}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateVehicle id={vehicle.id} />
                      <DeleteVehicle id={vehicle.id} />
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