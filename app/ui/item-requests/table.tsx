import { UpdateItemRequest, DeleteItemRequest } from '@/app/ui/item-requests/buttons';
import { fetchFilteredItemRequests } from '@/app/lib/item-requests/data';

export default async function ItemRequestsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const itemRequests = await fetchFilteredItemRequests(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {itemRequests?.map((itemRequest) => (
              <div
                key={itemRequest.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{itemRequest.item_name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{itemRequest.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{itemRequest.quantity}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>Mechanic ID: {itemRequest.mechanic_id}</p>
                    <p>Created At: {new Date(itemRequest.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateItemRequest id={itemRequest.id} />
                    <DeleteItemRequest id={itemRequest.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Item Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Quantity
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Mechanic ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created At
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {itemRequests?.map((itemRequest) => (
                <tr
                  key={itemRequest.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{itemRequest.item_name}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {itemRequest.status}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {itemRequest.quantity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {itemRequest.mechanic_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date(itemRequest.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateItemRequest id={itemRequest.id} />
                      <DeleteItemRequest id={itemRequest.id} />
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