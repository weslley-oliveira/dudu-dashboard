'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createCategory } from '@/app/lib/categories/actions';
import { useFormState } from 'react-dom';

type State = {
  errors?: {
    name?: string[];
    description?: string[];
  };
  message: string;
};

export default function CreateCategoryForm() {
  const initialState: State = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createCategory, initialState);

  console.log(dispatch, 'jjjjjjjjjjj')
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Category Name */}
        <div className="mb-4">
          <label htmlFor="category_name" className="mb-2 block text-sm font-medium">
            Category Name
          </label>
          <div className="relative">
            <input
              id="category_name"
              name="category_name"
              type="text"
              placeholder="Enter category name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="name-error"
            />
          </div>

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category_name &&
              state.errors.category_name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Category Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              placeholder="Enter category description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="description-error"
            />
          </div>

          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-green-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/categories"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Category</Button>
      </div>
    </form>
  );
}