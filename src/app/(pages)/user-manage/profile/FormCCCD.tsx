"use client"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from 'sonner';

// Đăng ký plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export const FormCCCD = () => {
  const { infoUser, refetch } = useAuth();
  const [cccdImages, setCCCDImages] = useState<any[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (infoUser && infoUser.so_cccd) {
      setExtractedData({
        so_cccd: infoUser.so_cccd,
        ho_va_ten: infoUser.ho_va_ten,
        ngay_sinh: infoUser.ngay_sinh,
        gioi_tinh: infoUser.gioi_tinh,
        quoc_tich: infoUser.quoc_tich,
        que_quan: infoUser.que_quan,
        noi_thuong_tru: infoUser.noi_thuong_tru,
        ngay_het_han: infoUser.ngay_het_han,
      });
    }
  }, [infoUser]);

  const handleExtractCCCD = async () => {
    if (cccdImages.length === 0) {
      toast.error('Vui lòng chọn ảnh CCCD!');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('cccdImage', cccdImages[0].file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cccd/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setExtractedData(data);
        toast.success('Trích xuất thông tin CCCD thành công!');
      } else {
        toast.error(data.error || 'Lỗi trích xuất thông tin CCCD');
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi kết nối');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCCCD = async () => {
    if (!extractedData) {
      toast.error('Không có dữ liệu CCCD để lưu!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cccd/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extractedData),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.code === 'success') {
        toast.success('Lưu thông tin CCCD thành công!');
        if (refetch && typeof refetch === 'function') {
          refetch(); // Refresh thông tin người dùng
        }
        setCCCDImages([]); // Xóa ảnh đã tải
      } else {
        toast.error(data.message || 'Lỗi lưu thông tin CCCD');
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi kết nối');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="grid grid-cols-1 gap-y-[20px]">
        {/* Upload CCCD Image */}
        <div className="border border-[#DEDEDE] rounded-[4px] p-[20px] bg-[#F9F9F9]">
          <h3 className="font-[700] text-[16px] text-black mb-[15px]">
            Tải lên ảnh CCCD
          </h3>
          <FilePond
            name="cccdImage"
            allowMultiple={false}
            allowRemove={true}
            labelIdle='Kéo thả ảnh CCCD hoặc nhấp để chọn'
            acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
            files={cccdImages}
            onupdatefiles={setCCCDImages}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleExtractCCCD}
            disabled={isLoading || cccdImages.length === 0}
            className="mt-[15px] bg-[#0088FF] hover:bg-[#0066CC] disabled:bg-gray-400 rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white transition"
          >
            {isLoading ? 'Đang xử lý...' : 'Trích xuất thông tin'}
          </button>
        </div>

        {/* Extracted Data Display */}
        {extractedData && (
          <div className="border border-[#DEDEDE] rounded-[4px] p-[20px] bg-white">
            <h3 className="font-[700] text-[16px] text-black mb-[15px]">
              Thông tin CCCD
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] mb-[20px]">
              <div>
                <label className="block font-[500] text-[14px] text-gray-600 mb-[5px]">
                  Số CCCD
                </label>
                <input
                  type="text"
                  value={extractedData.so_cccd || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, so_cccd: e.target.value })
                  }
                  className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>

              <div>
                <label className="block font-[500] text-[14px] text-gray-600 mb-[5px]">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={extractedData.ho_va_ten || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, ho_va_ten: e.target.value })
                  }
                  className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>

              <div>
                <label className="block font-[500] text-[14px] text-gray-600 mb-[5px]">
                  Ngày sinh (DD/MM/YYYY)
                </label>
                <input
                  type="text"
                  value={extractedData.ngay_sinh || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, ngay_sinh: e.target.value })
                  }
                  className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>

              <div>
                <label className="block font-[500] text-[14px] text-gray-600 mb-[5px]">
                  Giới tính
                </label>
                <input
                  type="text"
                  value={extractedData.gioi_tinh || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, gioi_tinh: e.target.value })
                  }
                  className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>

              <div>
                <label className="block font-[500] text-[14px] text-gray-600 mb-[5px]">
                  Quốc tịch
                </label>
                <input
                  type="text"
                  value={extractedData.quoc_tich || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, quoc_tich: e.target.value })
                  }
                  className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>

              <div>
                <label className="block font-[500] text-[14px] text-gray-600 mb-[5px]">
                  Que quán
                </label>
                <input
                  type="text"
                  value={extractedData.que_quan || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, que_quan: e.target.value })
                  }
                  className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-[500] text-[14px] text-gray-600 mb-[5px]">
                  Nơi thường trú
                </label>
                <input
                  type="text"
                  value={extractedData.noi_thuong_tru || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, noi_thuong_tru: e.target.value })
                  }
                  className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>

              <div>
                <label className="block font-[500] text-[14px] text-gray-600 mb-[5px]">
                  Ngày hết hạn
                </label>
                <input
                  type="text"
                  value={extractedData.ngay_het_han || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, ngay_het_han: e.target.value })
                  }
                  className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveCCCD}
              disabled={isLoading}
              className="w-full bg-[#28A745] hover:bg-[#20C997] disabled:bg-gray-400 rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white transition"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu thông tin CCCD'}
            </button>
          </div>
        )}

        {/* Display Saved CCCD Info */}
        {infoUser?.cccd_verified && (
          <div className="border border-[#28A745] rounded-[4px] p-[20px] bg-[#F0FFF4]">
            <h3 className="font-[700] text-[16px] text-[#28A745] mb-[15px]">
              ✓ Thông tin CCCD đã được xác nhận
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]">
              <div className="text-[14px]">
                <span className="font-[500] text-gray-600">Số CCCD:</span>
                <p className="text-black">{infoUser.so_cccd}</p>
              </div>
              <div className="text-[14px]">
                <span className="font-[500] text-gray-600">Họ và tên:</span>
                <p className="text-black">{infoUser.ho_va_ten}</p>
              </div>
              <div className="text-[14px]">
                <span className="font-[500] text-gray-600">Ngày sinh:</span>
                <p className="text-black">{infoUser.ngay_sinh}</p>
              </div>
              <div className="text-[14px]">
                <span className="font-[500] text-gray-600">Giới tính:</span>
                <p className="text-black">{infoUser.gioi_tinh}</p>
              </div>
              <div className="text-[14px]">
                <span className="font-[500] text-gray-600">Quốc tịch:</span>
                <p className="text-black">{infoUser.quoc_tich}</p>
              </div>
              <div className="text-[14px]">
                <span className="font-[500] text-gray-600">Que quán:</span>
                <p className="text-black">{infoUser.que_quan}</p>
              </div>
              <div className="sm:col-span-2 text-[14px]">
                <span className="font-[500] text-gray-600">Nơi thường trú:</span>
                <p className="text-black">{infoUser.noi_thuong_tru}</p>
              </div>
              <div className="text-[14px]">
                <span className="font-[500] text-gray-600">Ngày hết hạn:</span>
                <p className="text-black">{infoUser.ngay_het_han}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
