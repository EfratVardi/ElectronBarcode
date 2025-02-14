async function saveData(data) {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
    try {
        await Filesystem.writeFile({
            path: "data.json",
            data: JSON.stringify(data),
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        console.log("✅ Data saved to file!");
    } catch (error) {
        console.error("❌ Error saving file:", error);
    }
}

async function readData() {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
    try {
        const result = await Filesystem.readFile({
            path: "data.json",
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        console.log("📂 Data read from file:", JSON.parse(result.data));
        return JSON.parse(result.data);
    } catch (error) {
        console.warn("⚠ No file found, returning empty data.");
        return [];
    }
}

export { saveData, readData };
