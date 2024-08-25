import { useEffect, useState } from "react";
import ImagePicker from "./ImagePicker";
import Colors from "./Colors";
import { extractColors } from "extract-colors";
import { getTeam, updateTeam } from "../api";
import { throttle } from "lodash";
import { TeamDataType } from "../types";

type TeamDataProps = {
  readonly slug: string;
};

export default function TeamData({ slug }: TeamDataProps) {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamDataType | undefined>();

  const [editedName, setEditedName] = useState<string | undefined>();
  const [editedImage, setEditedImage] = useState<string | undefined>();
  const [editedPrimaryColor, setEditedPrimaryColor] = useState<
    string | undefined
  >();
  const [editedSecondaryColor, setEditedSecondaryColor] = useState<
    string | undefined
  >();
  const [palette, setPalette] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);

    getTeam(slug)
      .then((data) => {
        setTeam(data);
        setEditedName(data.name);
        setEditedImage(data.image);
        setEditedPrimaryColor(data.primaryColor);
        setEditedSecondaryColor(data.secondaryColor);

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
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
    updateTeam(slug, data);
  }, 1000);

  if (loading || !team) {
    return <div>Loading...</div>;
  }

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
