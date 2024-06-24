import { UpdateCompany, DeleteCompany } from '@/app/ui/companies/buttons';
import { fetchFilteredCompanies } from '@/app/lib/companies/data';

export default async function CompaniesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const companies = await fetchFilteredCompanies(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {companies?.map((company) => (
              <div
                key={company.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{company.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{company.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{company.phone}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{company.registration_number}</p>
                    <p>{company.address_city}, {company.address_state}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCompany id={company.id} />
                    <DeleteCompany id={company.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Registration Number
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Address
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {companies?.map((company) => (
                <tr
                  key={company.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{company.name}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {company.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {company.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {company.registration_number}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {company.address_city}, {company.address_state}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCompany id={company.id} />
                      <DeleteCompany id={company.id} />
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