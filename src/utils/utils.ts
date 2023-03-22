export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function download(
  content: string,
  fileName: string,
  contentType: string
) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
