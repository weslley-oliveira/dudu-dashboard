import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteRental } from '@/app/lib/rentals/actions';

export function CreateRental() {
  return (
    <Link
      href="/dashboard/rentals/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Rental</span>
      <PlusIcon className="h-5 w-5 md:ml-2" aria-hidden="true" />
    </Link>
  );
}

export function UpdateRental({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/rentals/${id}/edit`}
      className="flex items-center rounded-md border p-2 transition-colors hover:bg-gray-100"
    >
      <PencilIcon className="w-5 h-5" aria-hidden="true" />
      <span className="sr-only">Edit Rental</span>
    </Link>
  );
}

export function DeleteRental({ id }: { id: string }) {
  const deleteRentalWithId = deleteRental.bind(null, id);

  return (
    <form action={deleteRentalWithId}>
      <button
        type="submit"
        className="flex items-center rounded-md border p-2 transition-colors hover:bg-gray-100"
      >
        <TrashIcon className="w-5 h-5" aria-hidden="true" />
        <span className="sr-only">Delete Rental</span>
      </button>
    </form>
  );
}