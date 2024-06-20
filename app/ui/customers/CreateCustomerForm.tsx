'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCustomer } from '@/app/lib/customers/actions';
import { Button } from '@/app/ui/button';

type State = {
  errors?: {
    name?: string[];
    email?: string[];
    status?: string[];
    description?: string[];
  };
  message: string;
};

export default function CreateCustomerForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [state, setState] = useState<State>({ message: '' });
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('status', status);
    formData.append('description', description);

    const result = await createCustomer(formData);
    if (result.errors) {
      setState({ ...state, errors: result.errors, message: '' });
    } else {
      setState({ message: 'Customer created successfully!' });
      router.push('/dashboard/customers');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="name-error"
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter customer email"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="email-error"
            />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="relative">
            <input
              id="status"
              name="status"
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Enter customer status"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="status-error"
            />
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

        {/* Customer Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter customer description"
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
          {state.message && (
            <p className="mt-2 text-sm text-green-500">{state.message}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}