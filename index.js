let chosenFolder = "";
const fs = require('uxp').storage.localFileSystem;
let folderList = [];

async function pickWorkingDirectory(){
  //const app = require('photoshop').app;
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
    document.getElementById("warning-lbl").innerHTML = "Enter number of folders";
  }else if(chosenFolder == ""){
    document.getElementById("warning-lbl").innerHTML = "Pick a working directory";
  }else{
    try{
      for(let i = 0; i<numberOfFolders; i++){
        folderList.push(createDirectory(chosenFolder,i));
      }
      document.getElementById("warning-lbl").innerHTML = "Folders Successfully Created.";
    }catch{
      document.getElementById("warning-lbl").innerHTML = "Something went wrong.";
    }
  }
}

async function createDirectory(path, folderName){
  const myCollectionsFolder = await path.createFolder("img"+folderName);
  console.log("Created Folder")
  return myCollectionsFolder;
}


document.getElementById("pick-directory-btn").addEventListener("click", pickWorkingDirectory);
document.getElementById("create-directory-btn").addEventListener("click", createImageFolder);