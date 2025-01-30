'use client';
import { useCategories } from '@/hooks/useCategories';
import React from 'react';
import { LoadingImage } from '../LazyLoading/LoadingImage';
import { SessionType } from '@/types/SessionType';
import { Link } from '@/i18n/routing';
import { Spinner } from '@material-tailwind/react';

function CategoryComponent({ session }: { session: SessionType }) {
  const { listCategories, error, isLoading } = useCategories(
    session.accessToken,
  );
  console.log(listCategories);

  return (
    <div className="container mx-auto my-10 px-4">
      <div className="flex flex-row justify-between items-center">
        <p className="text-2xl font-bold">Categories</p>
        <Link href={'/categories'}>
          <p className="text-lg font-bold">View All</p>
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        {error && (
          <div className="flex flex-col border border-gray-200 justify-center items-center gap-1 p-20">
            <p>Error loading categories: {error.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col border border-gray-200 justify-center items-center gap-1 p-20">
            <Spinner className="w-12 h-12 text-blue-500" />
            <p>Loading categories...</p>
          </div>
        ) : (
          <>
            {listCategories &&
            listCategories.data &&
            listCategories.data.length > 0 ? (
              <ul className="flex space-x-2 lg:space-x-4">
                {listCategories.data.map((category) => (
                  <li
                    key={category.id}
                    className="border p-4 rounded shadow flex-none w-full md:w-1/3" // Setel lebar kategori
                  >
                    <LoadingImage
                      src={category.photo}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded"
                      width={500}
                      height={200}
                    />
                    <h2 className="text-lg font-semibold mt-2">
                      {category.name}
                    </h2>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No categories found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryComponent;
