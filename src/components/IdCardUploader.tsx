import React, { ChangeEvent, useState } from 'react';

interface Props {
  onUpload: (file: File) => void;
}

const IdCardUploader: React.FC<Props> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      // 建立圖片預覽
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">上傳身分證圖片</h2>
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded"
          onChange={handleFileChange}
        />
        {preview && (
          <div className="relative w-full max-w-md mx-auto">
            <img
              src={preview}
              alt="身分證預覽"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdCardUploader; 