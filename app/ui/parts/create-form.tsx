'use client';

import { CompaniesField } from '@/app/lib/companies/definitions';
import Link from 'next/link';
import {
  UserCircleIcon,
  CurrencyDollarIcon,
  TagIcon,
  IdentificationIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPart } from '@/app/lib/parts/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import UploadForm from '../upload/uploado-image-form';

export default function Form({ companies }: { companies: CompaniesField[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createPart, initialState);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileUpload = (url: string) => {
    setFileUrl(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <form action={dispatch} onKeyDown={handleKeyDown}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Enter part description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="description-error"
            />
            <CubeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

        {/* Brand */}
        <div className="mb-4">
          <label htmlFor="brand" className="mb-2 block text-sm font-medium">
            Brand
          </label>
          <div className="relative">
            <input
              id="brand"
              name="brand"
              type="text"
              placeholder="Enter brand name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="brand-error"
            />
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="brand-error" aria-live="polite" aria-atomic="true">
            {state.errors?.brand &&
              state.errors.brand.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Part Number and OEM Number */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label htmlFor="partNumber" className="mb-2 block text-sm font-medium">
              Part Number
            </label>
            <div className="relative">
              <input
                id="partNumber"
                name="partNumber"
                type="text"
                placeholder="Enter part number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="partNumber-error"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="partNumber-error" aria-live="polite" aria-atomic="true">
              {state.errors?.partNumber &&
                state.errors.partNumber.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="oemNumber" className="mb-2 block text-sm font-medium">
              OEM Number
            </label>
            <div className="relative">
              <input
                id="oemNumber"
                name="oemNumber"
                type="text"
                placeholder="Enter OEM number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="oemNumber-error"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="oemNumber-error" aria-live="polite" aria-atomic="true">
              {state.errors?.oemNumber &&
                state.errors.oemNumber.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Unit Price, Quantity, and UOM */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label htmlFor="unitPrice" className="mb-2 block text-sm font-medium">
              Unit Price
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="unitPrice-error"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div id="unitPrice-error" aria-live="polite" aria-atomic="true">
              {state.errors?.unitPrice &&
                state.errors.unitPrice.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="Enter quantity"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="quantity-error"
            />
            <div id="quantity-error" aria-live="polite" aria-atomic="true">
              {state.errors?.quantity &&
                state.errors.quantity.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="unitOfMeasurement" className="mb-2 block text-sm font-medium">
              UOM
            </label>
            <select
              id="unitOfMeasurement"
              name="unitOfMeasurement"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="unitOfMeasurement-error"
            >
              <option value="unit" disabled>Select a unit</option>
              <option value="unit">Unit</option>
              <option value="box">Box</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="litre">Litre</option>
              <option value="ml">Millilitre (ml)</option>
              <option value="meter">Meter (m)</option>
              <option value="cm">Centimeter (cm)</option>
              <option value="inch">Inch</option>
              <option value="foot">Foot</option>
            </select>
            <div id="unitOfMeasurement-error" aria-live="polite" aria-atomic="true">
              {state.errors?.unitOfMeasurement &&
                state.errors.unitOfMeasurement.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Company */}
        <div className="mb-4">
          <label htmlFor="companyId" className="mb-2 block text-sm font-medium">
            Company
          </label>
          <div className="relative">
            <select
              id="companyId"
              name="companyId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="companyId-error"
            >
              <option value="" disabled>
                Select a company
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="companyId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.companyId &&
              state.errors.companyId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product URL */}
        <div className="mb-4">
          <label htmlFor="productUrl" className="mb-2 block text-sm font-medium">
            Photo
          </label>
          <UploadForm onFileUpload={handleFileUpload} />
          <input id="productUrl" type="hidden" name="productUrl" value={String(fileUrl)} aria-describedby="productUrl"/>
          <div id="productUrl" aria-live="polite" aria-atomic="true">
            {state.errors?.companyId &&
              state.errors.companyId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/parts"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Part</Button>
      </div>
    </form>
  );
}