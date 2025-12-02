import { Metadata } from "next"
import { FormProfile } from "./FormProfile"
import { FormCCCD } from "./FormCCCD"

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
  description: "Mô tả trang thông tin cá nhân...",
}

export default function UserManageProfilePage() {
  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          {/* Thông tin cơ bản */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mb-[30px]">
            <h1 className="font-[700] text-[20px] text-black mb-[20px]">
              Thông tin cá nhân
            </h1>
            <FormProfile />
          </div>

          {/* Thông tin CCCD */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <h1 className="font-[700] text-[20px] text-black mb-[20px]">
              Thông tin CCCD
            </h1>
            <FormCCCD />
          </div>
        </div>
      </div>
    </>
  )
}