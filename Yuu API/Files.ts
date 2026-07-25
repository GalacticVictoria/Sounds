

export const Files = {
  exists: doesFileExist,
  text: {
    create: createTextFile,
    update: updateTextFile,
    get: getTextFile,
  },
  folder: {
    exists: doesFolderExist,
    create: createFolder,
    delete: deleteFolder,
    deleteContents: deleteFolderContents,
    getContents: getFolderContents,
    transpileTSToJS: transpileTSFolderToJSFolder,
    areTSFilesTranspiled: Godot.files.folder.areTSFilesTranspiled,
    tsFilesRemainingToBeCompiled: Godot.files.folder.tsFilesRemainingToBeCompiled,
  },
  zip: {
    compressFolder: compressFolderToZip,
    extractFiles: extractFilesFromZip,
  },
  utils: {
    combineBaseAndSubPaths,
  },
}


/**
 * Options used to select where a file will be saved (a few examples for now)
 * - 'user://worlds' example of where a vm / world files are stored
 * - 'user://profile' example to save user settings into
 * - 'vm' uses the path of the current vm
 *  */
export type DirectoryBasePaths = 'user://worlds' | 'user://profile' | 'vm';


let vmFolderPath = '';

function getBaseDirPath(baseDirPath: DirectoryBasePaths): string {
  if (baseDirPath === 'vm') {
    if (vmFolderPath === '') {
      vmFolderPath = Godot.files.folder.getVMPath();
    }
    
    return vmFolderPath;
  }
  else {
    return baseDirPath;
  }
}


/**
 * Check if a file exists
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPathToFile path to the file from the base directory, inclusive of the file name and extension
 * @returns boolean true if it exists
 */
function doesFileExist(baseDirPath: DirectoryBasePaths, subDirPathToFile: string) {
  return Godot.files.exists(combineBaseAndSubPaths(baseDirPath, subDirPathToFile));
}

/**
 * Check if a folder exists
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath path to the folder from the base directory
 * @returns boolean true if it exists
 */
function doesFolderExist(baseDirPath: DirectoryBasePaths, subDirPath: string) {
  return Godot.files.folder.exists(combineBaseAndSubPaths(baseDirPath, subDirPath));
}


/**
 * Create a text file (overwrites if it already exists)
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to save the text to
 * @param fileExtension to append at the end of the text file, ie. '.json' or '.txt'
 * @param content to save into the text file
 */
function createTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string, content: string) {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  Godot.files.text.create(dirPath, fileName, fileExtension, content);
}

/**
 * Update a text file (creates a file if it doesn't already exist)
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to save the text to
 * @param fileExtension to append at the end of the text file, ie. '.json' or '.txt'
 * @param content to save into the text file
 */
function updateTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string, content: string) {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  Godot.files.text.update(dirPath, fileName, fileExtension, content);
}

/**
 * Get the contents of a text file
 * @param baseDirPath all files are stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to get
 * @param fileExtension ie. '.txt'
 * @returns string contents, or undefined if unsuccessful
 */
function getTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string): string | undefined {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  return Godot.files.text.get(dirPath, fileName, fileExtension);
}


function createFolder(baseDirPath: DirectoryBasePaths, subDirPath: string) {
  Godot.files.folder.create(combineBaseAndSubPaths(baseDirPath, subDirPath));
}

function deleteFolder(baseDirPath: DirectoryBasePaths, subDirPath: string) {
  Godot.files.folder.delete(combineBaseAndSubPaths(baseDirPath, subDirPath));
}

function deleteFolderContents(baseDirPath: DirectoryBasePaths, subDirPath: string) {
  deleteFolder(baseDirPath, subDirPath);
  createFolder(baseDirPath, subDirPath);
}

/**
 * Get the contents of a dirPath
 * @param baseDirPath all files are stored in one of these base directories
 * @param subDirPath to get contents of
 * @param isRecursive if true will return contents of sub folders as well
 * @returns array of [directory path, file/folder name, file extension, "?" if no extension, or "" empty string for folders]
 */
function getFolderContents(baseDirPath: DirectoryBasePaths, subDirPath: string, isRecursive: boolean): [string, string, string][] {
  return Godot.files.folder.getContents(combineBaseAndSubPaths(baseDirPath, subDirPath), isRecursive);
}

/**
 * Transpile TS Files to JS, runs async, use areTSFilesTranspiled to check when it is completed
 * @param baseDirPathToTranspile folder to transpile
 * @param subDirPathToTranspile folder to transpile
 * @param baseSaveToDirPath folder to store js files into
 * @param subSaveToDirPath folder to store js files into
 * @returns boolean true if successfully queued
 */
function transpileTSFolderToJSFolder(baseDirPathToTranspile: DirectoryBasePaths, subDirPathToTranspile: string, baseSaveToDirPath: DirectoryBasePaths, subSaveToDirPath: string): boolean {
  return Godot.files.folder.transpileTSFolderToJSFolder(combineBaseAndSubPaths(baseDirPathToTranspile, subDirPathToTranspile), combineBaseAndSubPaths(baseSaveToDirPath, subSaveToDirPath));
}


/**
 * Compress the contents of a folder into a zip file at a specified location
 * @param baseDirPathToCompress folder to compress into a zip
 * @param subDirPathToCompress folder to compress into a zip
 * @param baseSaveZipToDirPath folder to save the zip file to
 * @param subSaveZipToDirPath folder to save the zip file to
 * @param zipFileName to use, without extension (ie. 'File_Name')
 * @returns boolean true if successful
 */
function compressFolderToZip(baseDirPathToCompress: DirectoryBasePaths, subDirPathToCompress: string, baseSaveZipToDirPath: DirectoryBasePaths, subSaveZipToDirPath: string, zipFileName: string): boolean {
  return Godot.files.zip.compressFolder(combineBaseAndSubPaths(baseDirPathToCompress, subDirPathToCompress), combineBaseAndSubPaths(baseSaveZipToDirPath, subSaveZipToDirPath), zipFileName);
}

/**
 * Extract files from a zip into a folder
 * @param baseDirPathOfZip to extract from, inclusive of extension (ie. user://worlds/folder_name/world_name.zip)
 * @param subDirPathOfZip to extract from, inclusive of extension (ie. user://worlds/folder_name/world_name.zip)
 * @param baseSaveDirPath location to save the uncompressed files to
 * @param subSaveDirPath location to save the uncompressed files to
 * @returns boolean true if successful
 */
function extractFilesFromZip(baseDirPathOfZip: DirectoryBasePaths, subDirPathOfZip: string, baseSaveDirPath: DirectoryBasePaths, subSaveDirPath: string): boolean {
  return Godot.files.zip.extractFiles(combineBaseAndSubPaths(baseDirPathOfZip, subDirPathOfZip), combineBaseAndSubPaths(baseSaveDirPath, subSaveDirPath));
}


function combineBaseAndSubPaths(baseDirPath: DirectoryBasePaths, subDirPath: string): string {
  let dirPath = getBaseDirPath(baseDirPath);

  if (subDirPath.length > 0 && subDirPath.charAt(0) !== '/') {
    dirPath += '/';
  }

  dirPath += subDirPath;

  return dirPath;
}