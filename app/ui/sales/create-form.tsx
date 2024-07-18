'use client';

import { CustomerField } from '@/app/lib/customers/definitions';
import { Vehicle } from '@/app/lib/vehicles/definitions';
import { PartField } from '@/app/lib/parts/definitions';
import Link from 'next/link';
import { useState } from 'react';
import {
  UserCircleIcon,
  TruckIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createSale } from '@/app/lib/sales/actions';
import { useFormState } from 'react-dom';

export default function Form({ customers, vehicles, parts }: { customers: CustomerField[], vehicles: Vehicle[], parts: PartField[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createSale, initialState);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [items, setItems] = useState<{ id: number; itemId: string; itemType: string; quantity: number; price: number; needsInstallation: boolean }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);

  const addItem = (item: { id: number; itemId: string; itemType: string; quantity: number; price: number; needsInstallation: boolean }) => {
    setItems([...items, item]);
    setTotal(total + item.price * item.quantity);
    setSearchTerm(''); // Clear search term when item is added
  };

  const removeItem = (id: number) => {
    const itemToRemove = items.find(item => item.id === id);
    if (itemToRemove) {
      setTotal(total - itemToRemove.price * itemToRemove.quantity);
      setItems(items.filter(item => item.id !== id));
    }
  };

  const toggleInstallation = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, needsInstallation: !item.needsInstallation } : item
    ));
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems(items => items.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0));
    const item = items.find(item => item.id === id);
    if (item) {
      setTotal(total + item.price * delta);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isNaN(total) || total <= 0) {
      alert('Total amount must be a valid number greater than 0.');
      return;
    }

    const formData = new FormData(e.target);
    formData.set('total', total.toString());

    dispatch(formData);
  };

  // Filtro para peças e veículos baseados no termo de pesquisa
  const filteredParts = parts.filter(part =>
    part.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Selection */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="mb-4">
          <label htmlFor="vehicle" className="mb-2 block text-sm font-medium">
            Choose vehicle
          </label>
          <div className="relative">
            <select
              id="vehicle"
              name="vehicleId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              aria-describedby="vehicle-error"
            >
              <option value="" disabled>
                Select a vehicle
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registration} - {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
            <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="vehicle-error" aria-live="polite" aria-atomic="true">
            {state.errors?.vehicleId &&
              state.errors.vehicleId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product Search */}
        <div className="mb-4">
          <label htmlFor="search" className="mb-2 block text-sm font-medium">
            Search parts or vehicles
          </label>
          <input
            id="search"
            type="text"
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Search Results */}
        {searchTerm.length >= 2 && (
          <div className="mb-4">
            <h2 className="text-lg font-medium">Search Results</h2>
            <div className="space-y-2">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between">
                  <span>{`${vehicle.registration} - ${vehicle.make} ${vehicle.model}`}</span>
                  <button
                    type="button"
                    onClick={() => addItem({ id: Date.now(), itemId: vehicle.id, itemType: 'vehicle', quantity: 1, price: Number(vehicle.sale_price), needsInstallation: false })}
                    className="flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {filteredParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between">
                  <span>{`${part.description} (${part.brand})`}</span>
                  <button
                    type="button"
                    onClick={() => addItem({ id: Date.now(), itemId: part.id, itemType: 'part', quantity: 1, price: Number(part.sale_price), needsInstallation: false })}
                    className="flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Items */}
        <div className="mt-4">
          <h2 className="text-lg font-medium">Items Selected</h2>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const selectedVehicle = vehicles.find(vehicle => vehicle.id === item.itemId);
                const selectedPart = parts.find(part => part.id === item.itemId);
                return (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      {item.itemType === 'vehicle' && selectedVehicle
                        ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.registration})`
                        : item.itemType === 'part' && selectedPart
                        ? `${selectedPart.description} (${selectedPart.brand})`
                        : ''}
                      {item.itemType === 'part' && (
                        <div className="ml-8 mt-2 flex items-center text-sm text-gray-500">
                          <input
                            type="checkbox"
                            checked={item.needsInstallation}
                            onChange={() => toggleInstallation(item.id)}
                            className="mr-2"
                          />
                          Needs installation
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 flex items-center">
                      {item.quantity === 1 ? (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                      )}
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </td>
                    <td className="px-4 py-2">${Number(item.price).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="mb-4 mt-4">
          <label htmlFor="total" className="mb-2 block text-sm font-medium">
            Total Amount: ${total.toFixed(2)}
          </label>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/sales"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Sale</Button>
      </div>
    </form>
  );
}
