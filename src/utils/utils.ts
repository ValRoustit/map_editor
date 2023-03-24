import { Cell, hex_to_string } from "./hex_utils";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function uniqCellArr(array: Cell[]) {
  const map = new Map<string, Cell>();

  array.forEach((el) => {
    map.set(hex_to_string(el), el);
  });

  return Array.from(map.values());
}

export function download(content: string, fileName: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export function upload(): Promise<File> {
  return new Promise((resolve) => {
    const inputFileElement = document.createElement("input");
    inputFileElement.setAttribute("type", "file");
    inputFileElement.setAttribute("multiple", "false");
    inputFileElement.setAttribute("accept", ".json");

    inputFileElement.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      const { files } = target;
      if (!files) return;

      resolve(files[0]);
    });
    inputFileElement.click();
  });
}

export function trimExtension(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, ""); // regex to remove file extension
}
