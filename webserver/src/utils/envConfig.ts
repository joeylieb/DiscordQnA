import {loadEnvConfig} from "@next/env";
import path from "node:path";

const projectDir = path.join(process.cwd());
loadEnvConfig(projectDir);

