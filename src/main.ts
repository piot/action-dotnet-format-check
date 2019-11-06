import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as os from 'os';
import * as path from 'path';

async function check(): Promise<number> {
  let workspace = core.getInput("workspace")
  if (workspace == '') {
    workspace = 'src/'
  }
  core.info(`Performing a dotnet format check on '${workspace}'`);

  // Dotnet format is now executed using the old format and directly form tool path
  // since `dotnet format` report the following error:
  //
  // "Since you just installed the .NET Core SDK, you will need to logout or restart your session before running the tool you installed.
  // You can invoke the tool using the following command: dotnet-format"

  const toolsPath = path.join(os.homedir(), '.dotnet/tools')
  const dotnetFormatExecutable = path.join(toolsPath, 'dotnet-format')
  const execString = `${dotnetFormatExecutable} --check --dry-run --verbosity diag --workspace ${workspace}`

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
