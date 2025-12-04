// export async function saveToUploads(file) {
//   const id = Date.now() + "-" + Math.random().toString(36).slice(2);
//   const ext = file.name.split(".").pop();
//   const newName = `${id}.${ext}`;

//   // Put file in IndexedDB (simulating uploaded files)
//   const db = await openDB();
//   await db.put("files", file, newName);

//   return `/uploads/${newName}`;
// }

// function openDB() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("uploads-db", 1);

//     request.onupgradeneeded = () => {
//       const db = request.result;
//       if (!db.objectStoreNames.contains("files")) {
//         db.createObjectStore("files");
//       }
//     };

//     request.onsuccess = () => resolve(request.result);
//     request.onerror = () => reject(request.error);
//   });
// }

// export async function getFile(name) {
//   const db = await openDB();
//   return db.get("files", name);
// }
