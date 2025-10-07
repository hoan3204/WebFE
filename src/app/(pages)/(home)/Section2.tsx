/* eslint-disable @typescript-eslint/no-explicit-any */
import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";

const getCompanyList = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=9`,
      {
        // Ensure fresh data on each build while still allowing caching at runtime.
        next: {
          revalidate: 60,
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (data?.code === "success" && Array.isArray(data.companyList)) {
      return data.companyList;
    }
  } catch (error) {
    console.error("Failed to fetch company list:", error);
  }

  return [];
};

export const Section2 = async () => {
  const companyList = await getCompanyList();

  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] text-center mb-[30px]">
            Nhà tuyển dụng hàng đầu
          </h2>
          {/* Wrap */}
          <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
            {/* Item */}
            {companyList.map((item: any) => (
              <CardCompanyItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}