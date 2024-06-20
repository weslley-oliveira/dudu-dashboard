'use client'
import { Product } from '@/app/lib/definitions';
import { useState } from 'react';

interface Accessory {
  product_name: string;
  observation: string;
}

interface AccessorySelectorProps {
  selectedAccessories: Accessory[];
  setSelectedAccessories: React.Dispatch<React.SetStateAction<Accessory[]>>;
}

export default function AccessorySelector({ selectedAccessories, setSelectedAccessories }: AccessorySelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [accessorySearch, setAccessorySearch] = useState('');
  const [observation, setObservation] = useState('');

  const handleAccessorySearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessorySearch(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await fetch(`/api/products?query=${e.target.value}`);
        const products = await response.json();
        if (response.ok) {
          setProducts(products);
        } else {
          console.error('Erro ao buscar produtos:', products.error);
          setProducts([]);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setProducts([]);
      }
    } else {
      setProducts([]);
    }
  };

  const handleAddAccessory = (product: Product) => {
    setSelectedAccessories([...selectedAccessories, { product_name: product.product_name, observation }]);
    setObservation('');
  };

  const handleObservationChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedAccessories = [...selectedAccessories];
    updatedAccessories[index].observation = e.target.value;
    setSelectedAccessories(updatedAccessories);
  };

  const handleRemoveAccessory = (index: number) => {
    const updatedAccessories = selectedAccessories.filter((_, i) => i !== index);
    setSelectedAccessories(updatedAccessories);
  };

  return (
    <div>
      {/* Accessories Search */}
      <div className="mb-4">
        <label htmlFor="accessorySearch" className="mb-2 block text-sm font-medium">
          Accessories
        </label>
        <input
          id="accessorySearch"
          name="accessorySearch"
          type="text"
          value={accessorySearch}
          onChange={handleAccessorySearchChange}
          placeholder="Search for accessories"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby="accessorySearch-error"
        />
        <div id="accessorySearch-error" aria-live="polite" aria-atomic="true">
          {/* Handle any accessory search errors here */}
        </div>
      </div>

      {/* Accessories List */}
      {products.length > 0 && (
        <ul className="mb-4">
          {products.map((product) => (
            <li key={product.id} className="border-b py-2 flex justify-between items-center">
              <div>
                {product.product_name}
              </div>
              <button
                type="button"
                onClick={() => handleAddAccessory(product)}
                className="bg-green-600 text-white rounded-lg p-2 ml-4"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Selected Accessories */}
      {selectedAccessories.length > 0 && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Selected Accessories</label>
          <ul>
            {selectedAccessories.map((accessory, index) => (
              <li key={index} className="border-b py-2">
                <div className="flex justify-between items-center">
                  <div>
                    {accessory.product_name}
                  </div>
                  <input
                    type="text"
                    placeholder="Observation"
                    value={accessory.observation}
                    onChange={(e) => handleObservationChange(e, index)}
                    className="peer ml-4 block w-60 rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAccessory(index)}
                    className="bg-red-600 text-white rounded-lg p-2 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}