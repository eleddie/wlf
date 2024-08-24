import { useState } from "react";

type ColorsProps = {
  readonly primaryColor?: string;
  readonly secondaryColor?: string;
  readonly setPrimaryColor: (color: string) => void;
  readonly setSecondaryColor: (color: string) => void;
  readonly palette: string[];
};

export default function Colors({
  primaryColor,
  secondaryColor,
  setPrimaryColor,
  setSecondaryColor,
  palette,
}: ColorsProps) {
  const [selectingColor, setSelectingColor] = useState(0);
  const onSelectColor = (color: string) => {
    if (selectingColor === 0) {
      setPrimaryColor(color);
      setSelectingColor(1);
    } else if (selectingColor === 1) {
      setSecondaryColor(color);
      setSelectingColor(0);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Palette palette={palette} onSelectColor={onSelectColor} />
      <hr />
      <Color
        id="primary"
        label={"Primary color"}
        color={primaryColor}
        setColor={setPrimaryColor}
      />
      <Color
        id="secondary"
        label={"Secondary color"}
        color={secondaryColor}
        setColor={setSecondaryColor}
      />
    </div>
  );
}

type ColorProps = {
  readonly id: string;
  readonly label: string;
  readonly color?: string;
  readonly setColor: (color: string) => void;
};

function Color({ id, label, color, setColor }: ColorProps) {
  return (
    <div className="flex flex-row items-center gap-4 justify-between">
      <label htmlFor={id} className="text-sm font-semibold text-lg">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        <div
          className="w-10 h-10 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}

type PaletteProps = {
  readonly palette: string[];
  readonly onSelectColor: (color: string) => void;
};

function Palette({ palette, onSelectColor }: PaletteProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <span className="text-sm font-semibold text-lg">Palette</span>
      <div className="flex flex-row gap-4">
        {palette.map((color) => (
          <button
            onClick={() => onSelectColor(color)}
            key={color}
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: color }}
          ></button>
        ))}
      </div>
    </div>
  );
}
