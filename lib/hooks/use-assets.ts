import { useAtom } from "jotai";
import { assetsAtom, addAssetAtom, selectedRowsAtom } from "@/lib/atoms/asset";
import { Asset } from "@/components/StakeTable";

export default function useAssets() {
  const [assetState, setAssetState] = useAtom(assetsAtom);
  const [, addAsset] = useAtom(addAssetAtom);
  const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom);

  const addItem = (asset: Omit<Asset, "id">) => {
    addAsset(asset);
  };

  const deleteSelectedItems = () => {
    const selectedIds = Object.keys(selectedRows)
      .filter((key) => selectedRows[key])
      .map((key) => parseInt(key));
    setAssetState((prev) => ({
      ...prev,
      assets: prev.assets.filter((asset) => !selectedIds.includes(asset.id)),
    }));
    setSelectedRows({});
  };

  return {
    items: assetState.assets,
    addItem,
    deleteSelectedItems,
    selectedRows,
    setSelectedRows,
  };
}
