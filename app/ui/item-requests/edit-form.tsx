'use client';

import { ItemRequest } from '@/app/lib/item-requests/definitions';
import { IdentificationIcon, PhoneIcon, AtSymbolIcon, MapPinIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateItemRequest } from '@/app/lib/item-requests/actions';
import { useFormState } from 'react-dom';

type State = {
  errors?: {
    mechanic_id?: string[];
    item_name?: string[];
    quantity?: string[];
    status?: string[];
  };
  message: string;
};

export default function EditItemRequestForm({
  itemRequest,
  parts,
  products,
}: {
  itemRequest: ItemRequest;
  parts: any[];
  products: any[];
}) {
  const initialState = { message: '', errors: {} };
  const updateItemRequestWithId = async (prevState: State, formData: FormData) => updateItemRequest(itemRequest.id, prevState, formData);
  const [state, dispatch] = useFormState(updateItemRequestWithId, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Mechanic ID */}
        <div className="mb-4">
          <label htmlFor="mechanic_id" className="mb-2 block text-sm font-medium">
            Mechanic ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="mechanic_id"
                name="mechanic_id"
                type="text"
                placeholder="Enter Mechanic ID"
                defaultValue={itemRequest.mechanic_id}
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

         {/* Item Name */}
         <div className="mb-4">
          <label htmlFor="item_id" className="mb-2 block text-sm font-medium">
            Chose Item
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="item_id"
                name="item_id"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="item_id-error"
              >
                <option value="" disabled>Select an Item</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.product_name}</option>
                ))}
                {parts.map((part) => (
                  <option key={part.id} value={part.id}>{part.description}</option>
                ))}
              </select>
              <ClipboardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="item_id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.item_id &&
              state.errors.item_id.map((error: string) => (
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
                defaultValue={itemRequest.quantity}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="quantity-error"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                defaultValue={itemRequest.status}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="status-error"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
        <Button type="submit">Edit Item Request</Button>
      </div>
    </form>
  );
}
