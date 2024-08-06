import { atom } from "jotai";
import { Asset } from "@/components/StakeTable";

export type AssetState = {
  assets: Asset[];
  idCounter: number;
};

const initialState: AssetState = {
  assets: [],
  idCounter: 0,
};

export const assetsAtom = atom<AssetState>(initialState);

export const addAssetAtom = atom(null, (get, set, asset: Omit<Asset, "id">) => {
  const currentState = get(assetsAtom);
  const newId = currentState.idCounter;
  const newAsset = { ...asset, id: newId };
  set(assetsAtom, {
    assets: [...currentState.assets, newAsset],
    idCounter: newId + 1,
  });
});

export const selectedRowsAtom = atom<Record<string, boolean>>({});
