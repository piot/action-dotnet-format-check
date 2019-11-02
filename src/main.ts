import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function check() : Promise<number> {
  const workspace = 'src/'

  core.info(`Performing a dotnet format check on '${workspace}'`);
  const execString = `dotnet format --check --dry-run --verbosity diag --workspace ${workspace}`

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
