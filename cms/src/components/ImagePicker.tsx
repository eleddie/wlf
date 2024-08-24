import { mdiImage } from "@mdi/js";
import Icon from "@mdi/react";

type ImagePickerProps = {
  readonly image?: string;
  readonly setImage: (image: string) => void;
};

export default function ImagePicker({ image, setImage }: ImagePickerProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.includes("image")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    const inputElement = document.getElementById("image-input");
    if (inputElement) {
      inputElement.click();
    }
  };

  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="bg-zinc-700 rounded-md flex items-center justify-center w-52 h-52">
        {image ? (
          <img
            src={image}
            alt="Selected"
            className="w-full h-full object-contain"
          />
        ) : (
          <Icon path={mdiImage} size={1} className="gray-500" />
        )}
      </div>
      <button onClick={handleButtonClick} className="mt-2">
        Select Image
      </button>
      <input
        id="image-input"
        type="file"
        accept="image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
