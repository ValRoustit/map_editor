import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faFile,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect } from "react";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { useMapContext } from "../../context/MapContext";
import useCtrlShortCut from "../../hooks/useCtrlShortCut";
import { trimExtension, upload } from "../../utils/utils";
import OptionButton from "./OptionButton";
import SaveModal from "./SaveModal";

export default function OptionsBar() {
  const { state, newMap, redo, undo } = useMapContext();

  const [storedMap, setStoredMap] = useLocalStorage("storedMap", {
    name: state.name,
    data: JSON.stringify(state.map),
  });

  useCtrlShortCut("z", undo); // TODO group in one switch logic
  useCtrlShortCut("y", redo);

  const handleUpload = useCallback(async () => {
    const mapData = await upload();
    const name = trimExtension(mapData.name);
    const map = await mapData.text();

    newMap(JSON.parse(map), name);
  }, [newMap]);

  useEffect(() => {
    setStoredMap({ name: state.name, data: JSON.stringify(state.map) });
  }, [setStoredMap, state.map, state.name]);

  useEffectOnce(() => {
    newMap(JSON.parse(storedMap.data), storedMap.name);
  });

  return (
    <header className="inline-flex w-full rounded-sm shadow-sm">
      <SaveModal />
      <OptionButton onClick={handleUpload}>
        <FontAwesomeIcon icon={faFolderOpen} />
        Open map
      </OptionButton>
      <OptionButton onClick={() => newMap()}>
        <FontAwesomeIcon icon={faFile} />
        new map
      </OptionButton>
      <OptionButton onClick={undo} disabled={!state.undos.length}>
        <FontAwesomeIcon icon={faArrowRotateLeft} />
        Undo
      </OptionButton>
      <OptionButton onClick={redo} disabled={!state.redos.length}>
        <FontAwesomeIcon icon={faArrowRotateRight} />
        Redo
      </OptionButton>
    </header>
  );
}
