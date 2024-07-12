import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteSale } from '@/app/lib/sales/actions';

export function CreateSale() {
  return (
    <Link
      href="/dashboard/sales/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Sale</span>
      <PlusIcon className="h-5 w-5 md:ml-2" aria-hidden="true" />
    </Link>
  );
}

export function UpdateSale({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/sales/${id}/edit`}
      className="flex items-center rounded-md border p-2 transition-colors hover:bg-gray-100"
    >
      <PencilIcon className="w-5 h-5" aria-hidden="true" />
      <span className="sr-only">Edit Sale</span>
    </Link>
  );
}

export function DeleteSale({ id }: { id: string }) {
  const deleteSaleWithId = deleteSale.bind(null, id);

  return (
    <form action={deleteSaleWithId}>
      <button
        type="submit"
        className="flex items-center rounded-md border p-2 transition-colors hover:bg-gray-100"
      >
        <TrashIcon className="w-5 h-5" aria-hidden="true" />
        <span className="sr-only">Delete Sale</span>
      </button>
    </form>
  );
}
