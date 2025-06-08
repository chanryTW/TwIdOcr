import React, { ChangeEvent } from 'react';

interface Props {
  onUpload: (file: File) => void;
}

const IdCardUploader: React.FC<Props> = ({ onUpload }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">上傳身分證圖片</h2>
      <input
        type="file"
        accept="image/*"
        className="w-full p-2 border rounded"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default IdCardUploader; 