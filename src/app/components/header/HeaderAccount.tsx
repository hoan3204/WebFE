import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

export const HeaderAccount = () => {
  const { isLogin, infoUser, infoCompany } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = (linkRedirect: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credentials: "include", // Gửi kèm cookie
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          router.push(linkRedirect);
        }
      });
  }

  return (
    <>
      <div
        className="inline-flex items-center gap-x-[5px] text-white font-[600] sm:text-[16px] text-[12px] relative"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        {isLogin ? (
          <>
            {/* Đã đăng nhập user */}
            {infoUser && (
              <>
                <button
                  type="button"
                  className="inline-flex items-center gap-x-[6px]"
                  onClick={handleToggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  <span>{infoUser.fullName}</span>
                  <FaAngleDown className="text-white text-[12px]" />
                </button>
                <ul
                  className={
                    "absolute top-[100%] right-[0px] w-[200px] bg-[#000065] z-[999] " +
                    (isDropdownOpen ? "block" : "hidden")
                  }
                >
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/user-manage/profile" className="text-white font-[600] text-[16px]">
                      Thông tin cá nhân
                    </Link>
                  </li>
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/user-manage/cv/list" className="text-white font-[600] text-[16px]">
                      Quản lý CV đã gửi
                    </Link>
                  </li>
                  <li
                    className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout("/user/login");
                    }}
                  >
                    Đăng xuất
                  </li>
                </ul>
              </>
            )}

            {/* Đã đăng nhập compnay */}
            {infoCompany && (
              <>
                <button
                  type="button"
                  className="inline-flex items-center gap-x-[6px]"
                  onClick={handleToggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  <span>{infoCompany.companyName}</span>
                  <FaAngleDown className="text-white text-[12px]" />
                </button>
                <ul
                  className={
                    "absolute top-[100%] right-[0px] w-[200px] bg-[#000065] z-[999] " +
                    (isDropdownOpen ? "block" : "hidden")
                  }
                >
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/company-manage/profile" className="text-white font-[600] text-[16px]">
                      Thông tin công ty
                    </Link>
                  </li>
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/company-manage/job/list" className="text-white font-[600] text-[16px]">
                      Quản lý công việc
                    </Link>
                  </li>
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/company-manage/cv/list" className="text-white font-[600] text-[16px]">
                      Quản lý CV
                    </Link>
                  </li>
                  <li
                    className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2 text-[16px]"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout("/company/login");
                    }}
                  >
                    Đăng xuất
                  </li>
                </ul>
              </>
            )}
          </>
        ) : (
          <>
            {/* Chưa đăng nhập */}
            <Link href="/user/login" className="">
              Đăng Nhập
            </Link>
            <span className="">/</span>
            <Link href="/user/register" className="">
              Đăng Ký
            </Link>
          </>
        )}
      </div>
    </>
  )
}