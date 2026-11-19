// Images are stored inline as data URLs so they sync to every collaborator
// (blob: URLs from URL.createObjectURL only resolve in the tab that made them).
export function readAsDataURL(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    })
}
