// app/[lang]/(dashboard)/(private)/products/list/page.tsx
import ProductsList from '@/views/apps/products/list'
import { fetchProducts } from '@/libs/fetchProducts'
import type { ExtendedProducts } from '@/utils/types'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: {
    page?: string
    pageSize?: string
  }
}

const ProductsPage = async ({ searchParams }: Props) => {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = parseInt(searchParams.pageSize || '10', 10)

  const data = await fetchProducts(page, pageSize)

  return (
    <div>
      <ProductsList
        products={data.products as ExtendedProducts[]}
        totalPages={data.totalPages}
        totalRecords={data.totalRecords}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}

export default ProductsPage
