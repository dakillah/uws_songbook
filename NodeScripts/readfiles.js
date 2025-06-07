const fs = require('fs');
const path = require('path');

function listFiles(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files;
  } catch (err) {
    console.error("Error reading directory:", err);
    return [];
  }
}

// Example usage:
//const folderPath = '../FrontEnd/songs'; // Replace with the path to your folder
const folderPath = '../../test_json'; // Replace with the path to your folder
const fileList = listFiles(folderPath);

if (fileList.length > 0) {
  console.log("Files in folder:");
  fileList.forEach(file => {
    console.log(path.join(folderPath, file)); // Print the full path
  });
} else {
  console.log("Folder is empty or does not exist.");
}
