import * as resolver from 'module';
import * as path from 'path';

const config = require('../../../tsconfig.json').compilerOptions;

(function registerModuleResolver() {
  const moduleResolver: any = resolver;
  const root = path.resolve(process.cwd(), config.outDir);
  const paths = Object
    .entries(config.paths)
    .reduce((result, [key, val]) => ({
      [key.replace('*', '')]: val[0].replace('*', ''),
      ...result,
    }), {});

  moduleResolver._originalResolveFilename = moduleResolver._resolveFilename;
  moduleResolver._resolveFilename = (request, ...arg) => {
    const [regex, replacement] = Object.entries(paths).find(([regexp]) => request.indexOf(regexp) === 0) || [];

    if (regex && replacement) {
      request = path.resolve(root, `${replacement}${request.substr(regex.length, request.length)}`);
    }

    return moduleResolver._originalResolveFilename(request, ...arg);
  };
})();

