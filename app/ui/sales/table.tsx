import { UpdateSale, DeleteSale } from '@/app/ui/sales/buttons';
import { fetchFilteredSales } from '@/app/lib/sales/data';
import { fetchCustomerById } from '@/app/lib/customers/data';

// Asynchronous component to render the customer name
async function CustomerName({ customerId }: { customerId: string }) {
  const customer = await fetchCustomerById(customerId);
  return <span>{customer ? customer.name : 'Customer not found'}</span>;
}

export default async function SalesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const sales = await fetchFilteredSales(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {sales?.map((sale) => (
              <div
                key={sale.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <CustomerName customerId={sale.customerId} />
                    </div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm text-gray-500">Sale Code: {sale.saleCode}</p>
                    </div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm text-gray-500">Status: {sale.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total: {sale.total}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateSale id={sale.id} />
                    <DeleteSale id={sale.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Sale Code
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sales?.map((sale) => (
                <tr
                  key={sale.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {sale.saleCode}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <CustomerName customerId={sale.customerId} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.status}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.total}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateSale id={sale.id} />
                      <DeleteSale id={sale.id} />
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
