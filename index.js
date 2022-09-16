async function pickWorkingDirectory(){
  //const app = require('photoshop').app;
  const fs = require('uxp').storage.localFileSystem;
  let folder = await fs.getFolder();
  let token = fs.createSessionToken(folder);
  console.log(token);
  console.log(folder);

  document.getElementById("directory-lbl").innerHTML = folder.nativePath


}

document.getElementById("pick-directory-btn").addEventListener("click", pickWorkingDirectory);