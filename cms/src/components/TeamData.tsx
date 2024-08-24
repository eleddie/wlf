import { useEffect, useState } from "react";
import ImagePicker from "./ImagePicker";
import Colors from "./Colors";
import { extractColors } from "extract-colors";
import { updateTeam } from "../api";
import { throttle } from "lodash";

export type TeamDataType = {
  readonly slug: string;
  readonly image?: string;
  readonly name?: string;
  readonly primaryColor?: string;
  readonly secondaryColor?: string;
};

export default function TeamData({
  slug,
  image,
  name,
  primaryColor,
  secondaryColor,
}: TeamDataType) {
  const [editedName, setEditedName] = useState(name);
  const [editedImage, setEditedImage] = useState<string | undefined>(image);
  const [editedPrimaryColor, setEditedPrimaryColor] = useState(primaryColor);
  const [editedSecondaryColor, setEditedSecondaryColor] =
    useState(secondaryColor);
  const [palette, setPalette] = useState<string[]>([]);

  useEffect(() => {
    // Extract colors from the edited image
    if (editedImage) {
      extractColors(editedImage, {
        crossOrigin: "anonymous",
      }).then((colors) => {
        setPalette(colors.map((color) => color.hex));
      });
    }
  }, [editedImage]);

  useEffect(() => {
    updateTeamData();
  }, [editedName, editedImage, editedPrimaryColor, editedSecondaryColor]);

  const updateTeamData = throttle(() => {
    const data = {
      slug,
      name: editedName,
      image: editedImage,
      primaryColor: editedPrimaryColor,
      secondaryColor: editedSecondaryColor,
    };
    if (data?.image?.startsWith("http://localhost:3000")) {
      delete data.image;
    }
    updateTeam(slug, data).then((data) => {
      console.log(data);
    });
  }, 1000);

  return (
    <div className="flex flex-col justify-center gap-12">
      <div className="flex flex-row items-center gap-12">
        <input
          className="text-6xl font-semibold bg-transparent border-b-2 border-gray-500 outline-none"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="Team Name"
        />
      </div>
      <div className="flex flex-row items-center gap-12">
        <ImagePicker image={editedImage} setImage={setEditedImage} />
        <Colors
          primaryColor={editedPrimaryColor}
          secondaryColor={editedSecondaryColor}
          setPrimaryColor={setEditedPrimaryColor}
          setSecondaryColor={setEditedSecondaryColor}
          palette={palette}
        />
      </div>
    </div>
  );
}
