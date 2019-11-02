"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function check() {
    return __awaiter(this, void 0, void 0, function* () {
        const workspace = 'src/';
        core.info(`Performing a dotnet format check on '${workspace}'`);
        // Dotnet format is now executed using the old format, since some builds report the following error:
        //
        // "Since you just installed the .NET Core SDK, you will need to logout or restart your session before running the tool you installed.
        // You can invoke the tool using the following command: dotnet-format"
        const execString = `dotnet-format --check --dry-run --verbosity diag --workspace ${workspace}`;
        return exec.exec(execString);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const exitCode = yield check();
            if (exitCode != 0) {
                core.setFailed("sorry, formatting was not according to dotnet format standard.");
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
