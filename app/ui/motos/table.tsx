import Image from 'next/image';
import { UpdateVehicle, DeleteVehicle } from '@/app/ui/motos/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { fetchFilteredVehicles } from '@/app/lib/data';
import { Vehicle } from '@/app/lib/definitions';

export default async function VehiclesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const vehicles = await fetchFilteredVehicles(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {vehicles?.map((vehicle) => (
              <div
                key={vehicle.VRN}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {/* <Image
                        src="/vehicle-placeholder.png" // Altere para a imagem real ou campo correto se disponível
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${vehicle.Make} ${vehicle.ModelVariant}`}
                      /> */}
                      <p>{vehicle.Make} {vehicle.ModelVariant}</p>
                    </div>
                    <p className="text-sm text-gray-500">{vehicle.VRN}</p>
                  </div>
                  <p className="text-sm text-gray-500">{vehicle.status}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{vehicle.Series}</p>
                    <p>{vehicle.EngineCapacity}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* Adicione botões de ação aqui, se necessário */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  VRN
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
                  TAX
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
              {vehicles?.map((vehicle) => (
                <tr
                  key={vehicle.VRN}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* <Image
                        src="/vehicle-placeholder.png" // Altere para a imagem real ou campo correto se disponível
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${vehicle.Make} ${vehicle.ModelVariant}`}
                      /> */}
                      <p>{vehicle.vrn}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.make}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.modelvariant}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    TEST-1212
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    TAX-e3232
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.status}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateVehicle id={vehicle.vrn} />
                      <DeleteVehicle id={vehicle.vrn} />
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