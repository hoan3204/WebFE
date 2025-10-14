import { Metadata } from "next"
import { SearchContainer } from "./SearchContainer"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Kết quả tìm kiếm",
  description: "Kết quả tìm kiếm công việc...",
}

export default function SearchPage() {
  return (
    <>
      {/* Kết quả tìm kiếm */}
      <div className="py-[60px]">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchContainer />
        </Suspense>
      </div>
      {/* Hết Kết quả tìm kiếm */}
    </>
  )
}