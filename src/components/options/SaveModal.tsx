import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMapContext } from "../../context/MapContext";
import { download } from "../../utils/utils";
import OptionButton from "./OptionButton";

export default function SaveModal() {
  const [fileName, setFileName] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);
  const { state, rename } = useMapContext();

  const handleOpenModal = useCallback(() => {
    modalRef.current?.showModal();
  }, []);

  const handleDownload = useCallback(() => {
    const mapData = JSON.stringify(state.map);
    rename(fileName);
    download(mapData, fileName);
    modalRef.current?.close();
  }, [fileName, rename, state.map]);

  const handleCancel = useCallback(() => {
    modalRef.current?.close();
  }, []);

  useEffect(() => {
    setFileName(state.name);
  }, [state.name]);

  return (
    <>
      <OptionButton onClick={handleOpenModal}>
        <FontAwesomeIcon icon={faFloppyDisk} />
        Save map
      </OptionButton>
      <dialog ref={modalRef}>
        <form method="dialog">
          <p>
            <label>
              Map name:
              <input
                type="text"
                value={fileName}
                className="block w-full rounded-sm border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                placeholder="map"
                onChange={(e) => setFileName(e.target.value)}
              />
            </label>
          </p>
          <div>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-gray-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
              value="cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-gray-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
              value="default"
              onClick={handleDownload}
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
