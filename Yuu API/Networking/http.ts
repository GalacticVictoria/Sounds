

// Consider using a class so that it works async

import { DirectoryBasePaths, Files } from "../Files";


export const http = {
  getJson,
  getGitHubJson,
  downloadZipToFolder,
}


function getJson<T = unknown>(host: string, path: string): T | undefined {
  return Godot.networking.http.getJSON(host, path);
}


function getGitHubJson(gitUserRepoUrl: string): GitData | undefined {
  const gitData = getJson<GitData>('api.github.com', '/repos/' + gitUserRepoUrl + '/releases/latest');

  return gitData;
}

/**
 * Download a zip from a url over http and save it to a folder with a given name
 * Note: slow connections will time out after 10 seconds and fail
 * @param hostURL domain to download from
 * @param pathURL on the hostURLs domain to download from
 * @param fileName to use without extension (ie. 'File_Name')
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath to save the zip into
 * @returns boolean true if successful
 */
function downloadZipToFolder(hostURL: string, pathURL: string, fileName: string, baseDirPath: DirectoryBasePaths, subDirPath: string): boolean {
  return Godot.networking.http.downloadZipToFolder(hostURL, pathURL, fileName, Files.utils.combineBaseAndSubPaths(baseDirPath, subDirPath));
}


export type GitData = {
  tag_name: string,
  name: string,
  zipball_url: string,
}