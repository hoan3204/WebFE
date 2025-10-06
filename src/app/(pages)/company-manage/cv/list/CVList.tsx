/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { positionList, workingFormList } from "@/config/variable";
import { useEffect, useState } from "react";
import { CVItem } from "./CVItem";

export const CVList = () => {
  const [listCV, setListCV] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/list`, {
      method: "GET",
      credentials: "include", // Gửi kèm cookie
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          setListCV(data.listCV);
        }
      })
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {listCV.map((item) => {
          item.jobPosition = positionList.find(itemPos => itemPos.value == item.jobPosition)?.label;
          item.jobWorkingForm = workingFormList.find(itemWork => itemWork.value == item.jobWorkingForm)?.label;

          return (
            <CVItem key={item.id} item={item} />
          )
        })}
      </div>

      <div className="mt-[30px]">
        <select name="" className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]">
          <option value="">Trang 1</option>
          <option value="">Trang 2</option>
          <option value="">Trang 3</option>
        </select>
      </div>
    </>
  )
}