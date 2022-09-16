# Photoshop Batch Export Helper

This plugin is designed to help with batch image processing. You will be asked to enter a number of folders based on how many image placeholders there are in your template. Then you should place the images that you want in the respective folders, and hit the 'Create CSV' button which is able to be imported into Photoshop.

## Load into Photoshop

Make sure Photoshop is up and running first. First, add the plugin to the "Developer Workspace" in the UXP Developer Tools (UDT) application.
  * If you selected "Create Plugin..." earlier, it will have already be there with the plugin ID and name you specified. 
  * Otherwise, click "Add Plugin" and select the `manifest.json` file in the corresponding plugin folder.

Click the ••• button next to the corresponding workspace entry, and click "Load". Switch over to Photoshop, and the plugin's panel will be running. 

## Continue creating

* Read more about creating and debugging plugins using the UDT application [here](https://developer.adobe.com/photoshop/uxp/2022/guides/devtool/udt-walkthrough/). 
* We build on this starter template and show you how to [edit a document](https://developer.adobe.com/photoshop/uxp/2022/guides/getting-started/editing-the-document/) and [write a file](https://developer.adobe.com/photoshop/uxp/2022/guides/getting-started/writing-a-file/) using UXP. 
