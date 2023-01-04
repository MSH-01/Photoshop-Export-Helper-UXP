// define current working folder
let chosenFolder = "";
// list of folders for temp images
let folderList = [];
// list of content from within each image folder
const folderContents = new Array();


// uxp definitions
const fs = require('uxp').storage.localFileSystem;
// const app = require('photoshop').app;


/**
 * Async function to delete all directories from folder list.
 */
async function resetDirectories(){
  if(folderList.length == 0){
    document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] No folders to delete.";
  }else{
    try{
      for(let i = 0; i<folderList.length;i++){
        let currentFolder = folderList[i];
        console.log("[WARN] Deleting: " + currentFolder.nativePath);
        let currentFolderEntries = await currentFolder.getEntries();
        console.log("[INFO] "+ currentFolderEntries);
        for(let j = 0;j<currentFolderEntries.length;j++){
          currentFolderEntries[j].delete();
          console.log("[INFO] " + currentFolderEntries[i]);
        }
        currentFolder.delete();
      }
      let csvFile = await chosenFolder.getEntry("variables.csv");
      csvFile.delete();
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Img folders successfully deleted.";
      folderList = [];

    }catch{
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Something went wrong.";
    }
  }
}

/**
 * Creates list of folder contents from folder parameter.
 * @myFolder current folder
 */
async function getFolderContents(myFolder){
  
  console.log("[INFO] Inside getFolderContents: " + myFolder);
  const entries = await myFolder.getEntries();
  const allFiles = entries.filter(entry => entry.isFile);
  let currentFolder = []
  for(let i = 0; i<allFiles.length;i++){
    currentFolder.push(myFolder.name+"/"+allFiles[i].name);
  }
  folderContents.push(currentFolder);
}

/**
 * Allows user to select their directory.
 */
async function pickWorkingDirectory(){
  let folder = await fs.getFolder();
  let token = fs.createSessionToken(folder);
  document.getElementById("directory-lbl").innerHTML = folder.nativePath;
  chosenFolder = folder;
}

/**
 * Loops through number submitted by user and calls createDirectory for each.
 */
async function createImageFolder(){
  let numberOfFolders = document.getElementById("image-folder-no").value;
  if(numberOfFolders == "" || 0){
    document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Enter number of folders";
  }else if(chosenFolder == ""){
    document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Pick a working directory";
  }else{
    try{
      for(let i = 0; i<numberOfFolders; i++){
        let folderName = "img"+String(i+1);
        createDirectory(chosenFolder,folderName);
      }
      createDirectory(chosenFolder, "temp");
      createDirectory(chosenFolder, "psd");
      createDirectory(chosenFolder, "output");
      document.getElementById("image-folder-no").value = "";
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Folders Successfully Created.";
    }catch{
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Something went wrong.";
    }
  }
}

/**
 * GENERIC FUNCTION - DON'T CHANGE
 * Creates a new folder with name img + (number in loop).
 * @path where folder will be created
 * @folderName number of folder
 */
async function createDirectory(path, folderName){
  //folderName = parseInt(folderName) + 1;
  const myCollectionsFolder = await path.createFolder(folderName);
  folderList.push(myCollectionsFolder);
}

/**
 * Returns current time.
 */
function getTime(){
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  return time
}

/**
 * Loops through list of folders and gets folder contents. Then calls writeLines with collated folderContents.
 */
 function createFolderContentList(){
  // console log
  console.log("[INFO] Inside createFolderContentList");
  // loop through folder list and call getFolderContents on each folder
  for(let i =0;i<folderList.length;i++){
    getFolderContents(folderList[i]);
    
  }
  // write lines called with folderContents
  writeLines(folderContents);
  
}

/**
 * Creates and writes lines to CSV.
 * @data the data to be written to CSV
 */
async function writeLines(data){
  try{
    console.log("[INFO] Creating CSV file.");
    let csvFile = await chosenFolder.createFile("variables.csv");
    let csvHeading = [];
    for(let i=0;i<folderList.length;i++){
      csvHeading.push("Image"+(i+1));
    }
    await csvFile.write(csvHeading);
    await csvFile.write("\n", {append : true});
    const folderCount = data.length;
    const groupedArray = data[0].map((_, i) => data.map(row => row[i]));
    console.log("[INFO] Beginning for loop for each cluster");
    for(let i=0;i<groupedArray.length;i++){
      await csvFile.write(groupedArray[i], {append : true});
      await csvFile.write("\n", {append : true});

    }
    
    document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] CSV Created.";
  }catch{
    document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Something went wrong.";
  }

}

/**
 * Assigns functions to the UI buttons.
 */
function assignFunctions(){
  document.getElementById("create-csv-btn").addEventListener("click", createFolderContentList);
  document.getElementById("pick-directory-btn").addEventListener("click", pickWorkingDirectory);
  document.getElementById("create-directory-btn").addEventListener("click", createImageFolder);
  document.getElementById("reset-directories-btn").addEventListener("click", resetDirectories);
}

assignFunctions();