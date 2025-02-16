
async function readFile(fileName) {
    try {
        const Filesystem = window.Capacitor.Plugins.Filesystem;
        const result = await Filesystem.readFile({
            path: fileName + ".txt",
            directory: "DOCUMENTS",
            encoding: "utf8"
        });
        return result.data;
    } catch (error) {
        console.error("❌ שגיאה בקריאת הקובץ:", error);
        return null;
    }
}

async function writeFile(fileName, data) {
    try {
        const Filesystem = window.Capacitor.Plugins.Filesystem;
        await Filesystem.writeFile({
            path: fileName + ".txt",
            data: data,
            directory: "DOCUMENTS",
            encoding: "utf8"
        });
        console.log("✅ קובץ נכתב בהצלחה");
    } catch (error) {
        console.error("❌ שגיאה בכתיבת הקובץ:", error);
    }
}
