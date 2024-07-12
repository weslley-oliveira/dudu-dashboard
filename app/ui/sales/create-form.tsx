'use client';

import { CustomerField } from '@/app/lib/customers/definitions';
import { VehicleField } from '@/app/lib/vehicles/definitions';
import { PartField } from '@/app/lib/parts/definitions';
import Link from 'next/link';
import { useState } from 'react';
import {
  CurrencyDollarIcon,
  UserCircleIcon,
  TruckIcon,
  CogIcon, // Icon for parts
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createSale } from '@/app/lib/sales/actions';
import { useFormState } from 'react-dom';

export default function Form({ customers, vehicles, parts }: { customers: CustomerField[], vehicles: VehicleField[], parts: PartField[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createSale, initialState);
  const [items, setItems] = useState<{ id: number; itemId: string; itemType: string; quantity: number; price: number }[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const addItem = () => {
    if (!selectedItem || quantity <= 0 || price <= 0) return;

    const selectedVehicle = vehicles.find(vehicle => vehicle.id === selectedItem);
    const selectedPart = parts.find(part => part.id === selectedItem);

    const newItem = {
      id: Date.now(),
      itemId: selectedItem,
      itemType: selectedVehicle ? 'vehicle' : 'part',
      quantity,
      price,
    };

    setItems([...items, newItem]);
    setTotal(total + price * quantity);
    setSelectedItem('');
    setQuantity(1);
    setPrice(0);
  };

  const removeItem = (id: number) => {
    const itemToRemove = items.find(item => item.id === id);
    if (itemToRemove) {
      setTotal(total - itemToRemove.price * itemToRemove.quantity);
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemSelection = (value: any) => {
    console.log('Selected item ID:', value);
    setSelectedItem(value);

    const selectedVehicle = vehicles.find(vehicle => vehicle.id === value);
    const selectedPart = parts.find(part => part.id === value);

    console.log('selectedVehicle:', selectedVehicle);
    console.log('selectedPart:', selectedPart);

    if (selectedVehicle) {
      console.log('Selected vehicle:', selectedVehicle);
      setPrice(selectedVehicle.sale_price); // Assume vehicles have a sale_price field
    } else if (selectedPart) {
      console.log('Selected part:', selectedPart);
      setPrice(selectedPart.sale_price); // Assume parts have a sale_price field
    } else {
      setPrice(0);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isNaN(total) || total <= 0) {
      alert('Total amount must be a valid number greater than 0.');
      return;
    }

    const formData = new FormData(e.target);
    formData.set('total', total.toString()); // Ensure total is sent as a string

    dispatch(formData);
  };

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
              defaultValue=""
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

        {/* Item Selection */}
        <div className="mb-4">
          <label htmlFor="item" className="mb-2 block text-sm font-medium">
            Choose item
          </label>
          <div className="relative flex items-center gap-2">
            <select
              id="item"
              name="itemId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={selectedItem}
              onChange={(e) => handleItemSelection(e.target.value)}
            >
              <option value="" disabled>
                Select an item
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.plate})
                </option>
              ))}
              {parts.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.description} ({part.brand})
                </option>
              ))}
            </select>
            <input
              type="number"
              name="quantity"
              className="peer block w-24 cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <input
              type="number"
              name="price"
              className="peer block w-24 cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Price"
              value={price}
              readOnly
            />
            <PlusIcon className="h-5 w-5 cursor-pointer text-blue-600" onClick={addItem} />
          </div>
        </div>

        {/* Selected Items */}
        <div className="mt-4">
          <h2 className="text-lg font-medium">Items Selected</h2>
          <ul className="list-disc pl-5">
            {items.map((item, index) => {
              const selectedVehicle = vehicles.find(vehicle => vehicle.id === item.itemId);
              const selectedPart = parts.find(part => part.id === item.itemId);
              return (
                <li key={index} className="mt-2 flex items-center justify-between">
                  {item.itemType === 'vehicle' && selectedVehicle
                    ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate}) - Quantity: ${item.quantity} - Price: $${item.price}`
                    : item.itemType === 'part' && selectedPart
                    ? `${selectedPart.description} (${selectedPart.brand}) - Quantity: ${item.quantity} - Price: $${item.price}`
                    : ''}
                  <TrashIcon className="h-5 w-5 cursor-pointer text-red-500" onClick={() => removeItem(item.id)} />
                </li>
              );
            })}
          </ul>
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
