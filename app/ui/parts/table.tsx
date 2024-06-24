import Image from 'next/image';
import { UpdatePart, DeletePart } from '@/app/ui/parts/buttons';
import { formatCurrency } from '@/app/lib/utils';
import { fetchFilteredParts } from '@/app/lib/parts/data';

export default async function PartsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const parts = await fetchFilteredParts(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {parts?.map((part) => (
              <div
                key={part.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={part.productUrl || '/placeholder.png'}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${part.description} image`}
                      />
                      <p>{part.description}</p>
                    </div>
                    <p className="text-sm text-gray-500">{part.brand}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(part.unitPrice)}
                    </p>
                    <p>Quantity: {part.quantity}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdatePart id={part.id} />
                    <DeletePart id={part.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Brand
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Unit Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Quantity
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {parts?.map((part) => (
                <tr
                  key={part.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={part.productUrl || '/placeholder.png'}
                        className="rounded-full h-full"
                        width={28}
                        height={28}
                        alt={`${part.description} image`}
                      />
                      <p>{part.description}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {part.brand}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(part.unitPrice)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {part.quantity}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePart id={part.id} />
                      <DeletePart id={part.id} />
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