import * as React from "react";
import { AssetsResultProps, useEditor } from "@grapesjs/react";
import { mdiClose, mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";
import type { Asset } from "grapesjs";
import { BTN_CLS } from "./common.ts";

export type CustomAssetManagerProps = Pick<
  AssetsResultProps,
  "assets" | "close" | "select"
>;

export default function CustomAssetManager({
  assets,
  select,
}: CustomAssetManagerProps) {
  const editor = useEditor();

  const remove = (asset: Asset) => {
    editor.Assets.remove(asset);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          editor.Assets.add({ src: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-3 relative h-[60vh]">
      <div className="grid grid-cols-5 gap-2 pr-2 h-[calc(100%-1rem)] overflow-y-auto">
        {assets.map((asset) => (
          <div
            key={asset.getSrc()}
            className="relative group rounded overflow-hidden w-32 h-32"
          >
            <div className="w-32 h-32 flex items-center justify-center bg-gray-200">
              <img
                className="w-full h-full object-cover"
                src={asset.getSrc()}
              />
            </div>
            <div className="flex flex-col items-center justify-end absolute top-0 left-0 w-full h-full p-5 bg-zinc-700/75 group-hover:opacity-100 opacity-0 transition-opacity">
              <button
                type="button"
                className={BTN_CLS}
                onClick={() => select(asset, true)}
              >
                Select
              </button>
              <button
                type="button"
                className="absolute top-2 right-2"
                onClick={() => remove(asset)}
              >
                <Icon size={1} path={mdiClose} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-3 flex items-center gap-2 fixed bottom-4 right-4 p-3">
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded bg-blue-500 text-white"
        >
          <Icon path={mdiUpload} size={1} />
          Upload Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}
