'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBox } from 'react-icons/fa';
import QuantityCounter from '@/app/ui/quantity-counter';
import Search from '@/app/ui/search';
import { Part } from '@/app/lib/parts/definitions';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SelectedPart {
  id: string;
  productUrl: string;
  description: string;
  brand: string;
  requestedQuantity: number;
}

export default function PartsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query') || '';
  const [query, setQuery] = useState(queryParam);
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestedQuantities, setRequestedQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const fetchParts = async () => {
      if (query.length < 2) {
        setParts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/parts?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch parts.');
        }
        const fetchedParts: Part[] = await response.json();
        setParts(fetchedParts);
      } catch (err) {
        setError('Failed to fetch parts.');
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, [query]);

  const handleQuantityChange = (id: string, quantity: number) => {
    setRequestedQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const handleAddPart = (part: Part) => {
    const requestedQuantity = requestedQuantities[part.id] || 0;
    if (requestedQuantity > 0) {
      setSelectedParts((prevSelectedParts) => {
        const existingPart = prevSelectedParts.find((p) => p.id === part.id);
        if (existingPart) {
          return prevSelectedParts.map((p) =>
            p.id === part.id
              ? { ...p, requestedQuantity: requestedQuantity + p.requestedQuantity }
              : p
          );
        }
        return [
          ...prevSelectedParts,
          {
            id: part.id,
            productUrl: part.productUrl,
            description: part.description,
            brand: part.brand,
            requestedQuantity,
          },
        ];
      });
    }
  };

  const handleRemovePart = (id: string) => {
    setSelectedParts((prevSelectedParts) => prevSelectedParts.filter((part) => part.id !== id));
  };

  return (
    <div className="p-4 flow-root bg-gray-50">
      <div className="mb-4">
        <label htmlFor="item_id" className="mb-2 block text-sm font-medium">
          Choose Item
        </label>
        <Search placeholder="Search item requests..." />
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg md:pt-0">
          <div className="md:hidden">
            {parts.map((part) => (
              <div key={part.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-3">
                    <Image
                      src={part.productUrl || '/placeholder.png'}
                      className="rounded-md w-8 h-8"
                      width={28}
                      height={28}
                      alt={`${part.description} image`}
                    />
                    <div>
                      <p>{part.description}</p>
                      <p className="text-sm text-gray-500">{part.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-full text-xs text-gray-500 px-4 py-1">
                      <p className="mr-2">{part.quantity}{'x'}</p>
                      <FaBox />
                    </div>
                  
                </div>
                <div className="mt-2">
                    <div className='flex gap-2 justify-between'>
                      <QuantityCounter
                        onChange={(requestedQuantity) => handleQuantityChange(part.id, requestedQuantity)}
                      />
                      <button
                        className="rounded-md border p-2 hover:bg-blue-100 bg-blue-400 text-white"
                        onClick={() => handleAddPart(part)}
                        disabled={requestedQuantities[part.id] === 0 || !requestedQuantities[part.id]}
                      >
                        <span className="sr-only">add</span>
                        <PlusCircleIcon className="w-5" />
                      </button>
                    </div>
                  </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            {parts.map((part) => (
              <div key={part.id} className="mb-2 w-full rounded-md bg-white p-2 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Image
                    src={part.productUrl || '/placeholder.png'}
                    className="rounded-md w-8 h-8"
                    width={18}
                    height={18}
                    alt={`${part.description} image`}
                  />
                  <p>
                    {part.description}
                    <span className="text-sm text-gray-500 ml-2">{part.brand}</span>
                  </p>
                  <div className="flex items-center bg-gray-100 rounded-full text-xs text-gray-500 px-4">
                    <p className="mr-2">{part.quantity}{'x'}</p>
                    <FaBox className="" />
                  </div>
                </div>
                <div className='flex items-center gap-2'>

                  <QuantityCounter
                    onChange={(requestedQuantity) => handleQuantityChange(part.id, requestedQuantity)}
                  />
                  <button
                    className="rounded-md border p-2 hover:bg-blue-100 bg-blue-400 text-white"
                    onClick={() => handleAddPart(part)}
                    disabled={requestedQuantities[part.id] === 0 || !requestedQuantities[part.id]}
                  >
                    <span className="sr-only">add</span>
                    <PlusCircleIcon className="w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected parts list */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Selected Parts</h2>
        <ul className="space-y-4">
          {selectedParts.map((selectedPart) => (
            <li key={selectedPart.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedPart.productUrl || '/placeholder.png'}
                  className="rounded-md w-8 h-8"
                  width={28}
                  height={28}
                  alt={`${selectedPart.description} image`}
                />
                <div>
                  <p>{selectedPart.description}</p>
                  <p className="text-sm text-gray-500">{selectedPart.brand}</p>
                </div>
                <div className="flex items-center bg-gray-100 rounded-full text-xs text-gray-500 px-4 py-1">
                  <p className="mr-2">{selectedPart.requestedQuantity}{'x'}</p>
                  <FaBox />
                </div>
              </div>
              <button className="rounded-md border p-2 hover:bg-gray-100" onClick={() => handleRemovePart(selectedPart.id)}>
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}