import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function check() : Promise<number> {
  const workspace = 'src/'

  core.info(`Performing a dotnet format check on '${workspace}'`);
  
  // Dotnet format is now executed using the old format, since some builds report the following error:
  //
  // "Since you just installed the .NET Core SDK, you will need to logout or restart your session before running the tool you installed.
  // You can invoke the tool using the following command: dotnet-format"

  const execString = `dotnet-format --check --dry-run --verbosity diag --workspace ${workspace}`

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
