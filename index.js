// define current working folder
let chosenFolder = "";
// list of folders for temp images
let folderList = [];
// list of content from within each image folder
let folderContents = [];

// uxp definitions
const fs = require('uxp').storage.localFileSystem;
const app = require('photoshop').app;


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
        currentFolder.delete();
      }
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Img folders successfully deleted.";
      folderList = [];

    }catch{
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Something went wrong.";
    }
  }
}

/**
 * creates list of folder contents from folder parameter.
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
 * loops through list of folders and gets folder contents. Then calls writeLines with collated folderContents.
 */
function getLinesToWrite(){
  // console log
  console.log("[INFO] Inside getLinesToWrite");
  // loop through folder list and call getFolderContents on each folder
  for(let i =0;i<folderList.length;i++){
    getFolderContents(folderList[i]);
    
  }
  // write lines called with folderContents
  writeLines(folderContents);
  
}

/**
 * allows user to select their directory.
 */
async function pickWorkingDirectory(){
  let folder = await fs.getFolder();
  let token = fs.createSessionToken(folder);
  document.getElementById("directory-lbl").innerHTML = folder.nativePath;
  chosenFolder = folder;
}

/**
 * loops through number submitted by user and calls createDirectory for each.
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
        createDirectory(chosenFolder,i);
      }
      document.getElementById("image-folder-no").value = "";
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Folders Successfully Created.";
    }catch{
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Something went wrong.";
    }
  }
}

/**
 * creates a new folder with name img + (number in loop).
 */
async function createDirectory(path, folderName){
  folderName = parseInt(folderName) + 1;
  const myCollectionsFolder = await path.createFolder("img"+folderName);
  folderList.push(myCollectionsFolder);
}

/**
 * returns current time.
 */
function getTime(){
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  return time
}

/**
 * logs and calls getLinesToWrite.
 */
async function writeCSV(){
  console.log("[INFO] CSV Created.");
  getLinesToWrite();
}

/**
 * creates and writes lines to CSV
 * @data the data to be written to CSV
 */
async function writeLines(data){
  console.log("[INFO] Creating CSV file.");
  let csvFile = await chosenFolder.createFile("variables.csv");
  let folderNames = [];
  for(let i=0;i<folderList.length;i++){
    folderNames.push("Image"+(i+1));
  }
  await csvFile.write(folderNames);
  await csvFile.write("\n", {append : true});
  await csvFile.write(data[0], {append : true});
  await csvFile.write("\n", {append : true});
  await csvFile.write(data[1], {append : true});
}

/**
 * assigns functions to the UI buttons.
 */
function assignFunctions(){
  document.getElementById("create-csv-btn").addEventListener("click", writeCSV);
  document.getElementById("pick-directory-btn").addEventListener("click", pickWorkingDirectory);
  document.getElementById("create-directory-btn").addEventListener("click", createImageFolder);
  document.getElementById("reset-directories-btn").addEventListener("click", resetDirectories);
}

assignFunctions();