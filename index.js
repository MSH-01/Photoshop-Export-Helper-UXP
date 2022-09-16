let chosenFolder = "";
let folderList = [];
const fs = require('uxp').storage.localFileSystem;
const app = require('photoshop').app;

async function resetDirectories(){
  if(folderList.length == 0){
    document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] No folders to delete.";
  }else{
    for(let i = 0; i<folderList.length;i++){
      console.log("trying to delete a folder");
      console.log(folderList[i]);
    }
  }
}

async function pickWorkingDirectory(){
  let folder = await fs.getFolder();
  let token = fs.createSessionToken(folder);
  console.log(token);
  console.log(folder);
  document.getElementById("directory-lbl").innerHTML = folder.nativePath;
  chosenFolder = folder;
}

async function createImageFolder(){
  let numberOfFolders = document.getElementById("image-folder-no").value;
  if(numberOfFolders == "" || 0){
    document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Enter number of folders";
  }else if(chosenFolder == ""){
    document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Pick a working directory";
  }else{
    try{
      for(let i = 0; i<numberOfFolders; i++){
        folderList.push(createDirectory(chosenFolder,i));
      }
      document.getElementById("image-folder-no").value = "";
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Folders Successfully Created.";
    }catch{
      document.getElementById("warning-lbl").innerHTML = "[" +getTime() + "] Something went wrong.";
    }
  }
}

async function createDirectory(path, folderName){
  folderName = parseInt(folderName) + 1;
  const myCollectionsFolder = await path.createFolder("img"+folderName);
  console.log("Created Folder");
  return myCollectionsFolder;
}

function getTime(){
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  return time
}



document.getElementById("pick-directory-btn").addEventListener("click", pickWorkingDirectory);
document.getElementById("create-directory-btn").addEventListener("click", createImageFolder);
document.getElementById("reset-directories-btn").addEventListener("click", resetDirectories);