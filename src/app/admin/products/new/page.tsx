// src/app/admin/products/new/page.tsx
import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">
          Fill in the details below. The product will appear on the public
          catalog once you set it as visible.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm mode="new" />
      </div>
    </div>
  );
}