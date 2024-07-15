import { UpdateVehicle, DeleteVehicle } from '@/app/ui/vehicles/buttons';
import { fetchFilteredVehicles } from '@/app/lib/vehicles/data';
import { Vehicle } from '@/app/lib/vehicles/definitions';
import { checkExpiryDate } from '@/app/lib/utils';

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
                    <p className="text-sm text-gray-500">{vehicle.registration}</p>
                    <div className="my-2 flex items-center">
                      <p><span className='font-semibold'>{vehicle.make}</span> {vehicle.model}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{vehicle.status}</p>
                  
                </div>
                <div className='pt-2 flex items-center justify-between'>
                    <p>MOT</p>
                    <p>{checkExpiryDate(vehicle.mot)}</p>
                  </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{vehicle.manufacturedate}</p>
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
                    <p>{vehicle.registration}</p>
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