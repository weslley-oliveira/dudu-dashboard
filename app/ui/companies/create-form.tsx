'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  AtSymbolIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCompany } from '@/app/lib/companies/actions';
import { useFormState } from 'react-dom';

export default function Form() {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createCompany, initialState);

  return (
    <form action={dispatch}>
  <div className="rounded-md bg-gray-50 p-4 md:p-6">
    {/* Company Name */}
    <div className="mb-4">
      <label htmlFor="name" className="mb-2 block text-sm font-medium">
        Company Name
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter Company Name"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
          />
          <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
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

    {/* Registration Number */}
    <div className="mb-4">
      <label htmlFor="registration_number" className="mb-2 block text-sm font-medium">
        Registration Number
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="registration_number"
            name="registration_number"
            type="text"
            placeholder="Enter Registration Number"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="registration_number-error"
          />
          <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="registration_number-error" aria-live="polite" aria-atomic="true">
        {state.errors?.registration_number &&
          state.errors.registration_number.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* VAT Number */}
    <div className="mb-4">
      <label htmlFor="vat_number" className="mb-2 block text-sm font-medium">
        VAT Number (optional)
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="vat_number"
            name="vat_number"
            type="text"
            placeholder="Enter VAT Number"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="vat_number-error"
          />
          <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="vat_number-error" aria-live="polite" aria-atomic="true">
        {state.errors?.vat_number &&
          state.errors.vat_number.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Address Street */}
    <div className="mb-4">
      <label htmlFor="address_street" className="mb-2 block text-sm font-medium">
        Street
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="address_street"
            name="address_street"
            type="text"
            placeholder="Enter Street"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="address_street-error"
          />
          <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="address_street-error" aria-live="polite" aria-atomic="true">
        {state.errors?.address_street &&
          state.errors.address_street.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Address Number */}
    <div className="mb-4">
      <label htmlFor="address_number" className="mb-2 block text-sm font-medium">
        Number
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="address_number"
            name="address_number"
            type="text"
            placeholder="Enter Number"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="address_number-error"
          />
          <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="address_number-error" aria-live="polite" aria-atomic="true">
        {state.errors?.address_number &&
          state.errors.address_number.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Address Complement */}
    <div className="mb-4">
      <label htmlFor="address_complement" className="mb-2 block text-sm font-medium">
        Complement
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="address_complement"
            name="address_complement"
            type="text"
            placeholder="Enter Complement"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="address_complement-error"
          />
          <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="address_complement-error" aria-live="polite" aria-atomic="true">
        {state.errors?.address_complement &&
          state.errors.address_complement.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Address City */}
    <div className="mb-4">
      <label htmlFor="address_city" className="mb-2 block text-sm font-medium">
        City
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="address_city"
            name="address_city"
            type="text"
            placeholder="Enter City"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="address_city-error"
          />
          <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="address_city-error" aria-live="polite" aria-atomic="true">
        {state.errors?.address_city &&
          state.errors.address_city.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Address State */}
    <div className="mb-4">
      <label htmlFor="address_state" className="mb-2 block text-sm font-medium">
        State
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="address_state"
            name="address_state"
            type="text"
            placeholder="Enter State"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="address_state-error"
          />
          <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="address_state-error" aria-live="polite" aria-atomic="true">
        {state.errors?.address_state &&
          state.errors.address_state.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Address Postcode */}
    <div className="mb-4">
      <label htmlFor="address_postcode" className="mb-2 block text-sm font-medium">
        Postcode
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="address_postcode"
            name="address_postcode"
            type="text"
            placeholder="Enter Postcode"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="address_postcode-error"
          />
          <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="address_postcode-error" aria-live="polite" aria-atomic="true">
        {state.errors?.address_postcode &&
          state.errors.address_postcode.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Phone */}
    <div className="mb-4">
      <label htmlFor="phone" className="mb-2 block text-sm font-medium">
        Phone
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="Enter Phone Number"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="phone-error"
          />
          <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div id="phone-error" aria-live="polite" aria-atomic="true">
        {state.errors?.phone &&
          state.errors.phone.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Email */}
    <div className="mb-4">
      <label htmlFor="email" className="mb-2 block text-sm font-medium">
        Email
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter Email"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="email-error"
          />
          <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
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

    <div aria-live="polite" aria-atomic="true">
      {state.message ? (
        <p className="mt-2 text-sm text-red-500">{state.message}</p>
      ) : null}
    </div>
  </div>
  <div className="mt-6 flex justify-end gap-4">
    <Link
      href="/dashboard/management/companies"
      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
    >
      Cancel
    </Link>
    <Button type="submit">Create Company</Button>
  </div>
</form>

  );
}