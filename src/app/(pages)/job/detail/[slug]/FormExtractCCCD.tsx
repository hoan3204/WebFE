/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
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

export const FormExtractCCCD = (props: {
  onExtractedName: (name: string) => void;
  disabled?: boolean;
}) => {
  const { onExtractedName, disabled } = props;
  const [cccdImages, setCCCDImages] = useState<any[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
      });

      const data = await response.json();

      if (response.ok) {
        setExtractedData(data);
        onExtractedName(data.ho_va_ten);
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

  const handleReset = () => {
    setCCCDImages([]);
    setExtractedData(null);
    onExtractedName("");
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="border border-[#DEDEDE] rounded-[4px] p-[15px] bg-[#F9F9F9]">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          className="w-full flex justify-between items-center font-[500] text-[14px] text-black hover:text-[#0088FF] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Trích xuất tên từ CCCD (Tùy chọn)</span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {isExpanded && (
          <div className="mt-[15px] pt-[15px] border-t border-[#DEDEDE]">
            {/* Upload CCCD Image */}
            {!extractedData && (
              <div className="mb-[15px]">
                <label className="block font-[500] text-[12px] text-gray-600 mb-[8px]">
                  Chọn ảnh CCCD để trích xuất tên
                </label>
                <FilePond
                  name="cccdImage"
                  allowMultiple={false}
                  allowRemove={true}
                  labelIdle='Kéo thả ảnh hoặc nhấp để chọn'
                  acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                  files={cccdImages}
                  onupdatefiles={setCCCDImages}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleExtractCCCD}
                  disabled={isLoading || cccdImages.length === 0}
                  className="mt-[10px] w-full bg-[#0088FF] hover:bg-[#0066CC] disabled:bg-gray-400 rounded-[4px] h-[40px] px-[15px] font-[600] text-[14px] text-white transition"
                >
                  {isLoading ? 'Đang xử lý...' : 'Trích xuất'}
                </button>
              </div>
            )}

            {/* Display Extracted Name */}
            {extractedData && (
              <div className="bg-[#F0FFF4] border border-[#28A745] rounded-[4px] p-[12px] mb-[10px]">
                <div className="flex justify-between items-start gap-[10px]">
                  <div className="flex-1">
                    <p className="font-[500] text-[12px] text-gray-600 mb-[4px]">
                      Tên từ CCCD:
                    </p>
                    <p className="font-[600] text-[14px] text-[#28A745]">
                      {extractedData.ho_va_ten}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[12px] px-[10px] py-[4px] rounded-[3px] bg-[#DEDEDE] hover:bg-gray-400 transition text-black font-[500]"
                  >
                    Thay đổi
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
