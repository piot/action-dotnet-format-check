import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as os from 'os';
import * as path from 'path';

async function check(): Promise<number> {
  let directory = core.getInput('path')
  let locationType = 'folder'
  let location = directory
  if (directory == '') {
    locationType = 'workspace'
    let workspace = core.getInput('workspace')
    if (workspace == '') {
      workspace = 'src/'
    }
    location = workspace
    core.info(`Performing a dotnet format check on '${location}'`);
  } else {
    core.info(`Performing a dotnet format check on folder '${location}'`);
  }

  // Dotnet format is now executed using the old format and directly form tool path
  // since `dotnet format` report the following error:
  //
  // "Since you just installed the .NET Core SDK, you will need to logout or restart your session before running the tool you installed.
  // You can invoke the tool using the following command: dotnet-format"

  const toolsPath = path.join(os.homedir(), '.dotnet/tools')
  const dotnetFormatExecutable = path.join(toolsPath, 'dotnet-format')
  const execString = `${dotnetFormatExecutable} --check --dry-run --verbosity diag --${locationType} ${location}`

  return exec.exec(execString)
}

async function run() {
  try {
    const exitCode = await check();
    if (exitCode != 0) {
      core.setFailed("sorry, formatting was not according to dotnet format standard.")
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
