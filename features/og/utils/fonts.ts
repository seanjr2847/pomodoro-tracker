export async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(
      "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap"
    );
    const css = await response.text();
    const fontUrl = css.match(/url\(([^)]+)\)/)?.[1];
    if (!fontUrl) return null;
    const fontResponse = await fetch(fontUrl);
    return fontResponse.arrayBuffer();
  } catch {
    return null;
  }
}
