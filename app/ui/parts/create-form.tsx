'use client';

import { CompaniesField, Company } from '@/app/lib/companies/definitions';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPart } from '@/app/lib/parts/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import UploadForm from '../upload/uploado-image-form';

interface FormProps {
  companies: CompaniesField[];
}

export default function Form({ companies }: FormProps) {
  const initialState = { message: '', errors: {} };
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const handleFileUpload = (url: string) => {
    setFileUrl(url);
  };

  const [state, dispatch] = useFormState(createPart, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            required
          />
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
          <input
            id="brand"
            name="brand"
            type="text"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <div id="brand-error" aria-live="polite" aria-atomic="true">
            {state.errors?.brand &&
              state.errors.brand.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* OEM Number */}{/* Part Number */}
        <div className='flex gap-2'>
          <div className="mb-4 w-full">
            <label htmlFor="partNumber" className="mb-2 block text-sm font-medium">
              Part Number
            </label>
            <input
              id="partNumber"
              name="partNumber"
              type="text"
              className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <div id="partNumber-error" aria-live="polite" aria-atomic="true">
              {state.errors?.partNumber &&
                state.errors.partNumber.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-4 w-full">
            <label htmlFor="oemNumber" className="mb-2 block text-sm font-medium">
              OEM Number
            </label>
            <input
              id="oemNumber"
              name="oemNumber"
              type="text"
              className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              required
            />
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

        <div className='flex gap-2'>
          {/* Unit Price */}
          <div className="mb-4 w-full">
            <label htmlFor="unitPrice" className="mb-2 block text-sm font-medium">
              Unit Price
            </label>
            <input
              id="unitPrice"
              name="unitPrice"
              type="number"
              step="0.01"
              className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <div id="unitPrice-error" aria-live="polite" aria-atomic="true">
              {state.errors?.unitPrice &&
                state.errors.unitPrice.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4 w-full">
            <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              required
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

          {/* Unit of Measurement */}
          <div className="mb-4 w-full">
            <label htmlFor="unitOfMeasurement" className="mb-2 block text-sm font-medium">
              Unit of Measurement
            </label>
            <select
              id="unitOfMeasurement"
              name="unitOfMeasurement"
              className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
              aria-describedby="unitOfMeasurement-error"
            >
              <option value="" disabled>
                Select a unit
              </option>
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
          <select
            id="companyId"
            name="companyId"
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            defaultValue=""
            required
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
          <input type="hidden" name="productUrl" value={String(fileUrl)} />
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