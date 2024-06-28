'use client';

import Link from 'next/link';
import { IdentificationIcon, ClipboardIcon, TagIcon, CubeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createItemRequest } from '@/app/lib/item-requests/actions';
import { useFormState } from 'react-dom';
import { Product } from '@/app/lib/products/definitions';
import { Part } from '@/app/lib/parts/definitions';
import Search from '../search';
import PartsTable from './part-list';

export default function Form({ products, parts, query }: { products: Product[], parts: Part[], query: string }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createItemRequest, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Mechanic ID */}
        <div className="mb-4">
          <label htmlFor="mechanic_id" className="mb-2 block text-sm font-medium">
            Mechanic ID {query}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="mechanic_id"
                name="mechanic_id"
                type="text"
                placeholder="Enter Mechanic ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="mechanic_id-error"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="mechanic_id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.mechanic_id &&
              state.errors.mechanic_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
            Quantity
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter Quantity"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="quantity-error"
              />
              <CubeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="quantity-error" aria-live="polite" aria-atomic="true">
            {state.errors?.quantity &&
              state.errors.quantity.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="status"
                name="status"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="status-error"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/item-requests"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Item Request</Button>
      </div>
    </form>
  );
}