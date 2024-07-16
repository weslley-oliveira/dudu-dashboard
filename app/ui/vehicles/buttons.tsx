import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteVehicle } from '@/app/lib/vehicles/actions';

export function CreateVehicle() {
  return (
    <Link
      href="/dashboard/inventory/vehicles/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Vehicle</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateVehicle({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/inventory/vehicles/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function SeeVehicle({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/inventory/vehicles/${id}`}
      className="rounded-md border p-2 bg-blue-500 text-white flex gap-2"
    >
      <PlusIcon className="w-5" />
      <span className="">Details</span>
    </Link>
  );
}

export function DeleteVehicle({ id }: { id: string }) {
  
  function handleOnClick(){
    deleteVehicle(id);
  }

  return (
    
      <button 
      className="rounded-md border p-2 hover:bg-gray-100"
      onClick={handleOnClick}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
  );
}
