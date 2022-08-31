import { ensureDirSync, moveSync } from "https://deno.land/std@0.139.0/fs/mod.ts";
import { ifiles, extensiones } from "./interfaces.ts";
import { folders } from "./admitidos.ts";

let path: string = Deno.args.length > 0 ?
  Deno.args[0] :
  prompt('ingresa el directorio que deseas ordenar') || '';
if (path[path.length - 1] != "\\" || path[path.length - 1] != "/") path = path + '/'

let { archivos, carpetas }: { archivos: ifiles[], carpetas: string[] } = { archivos: [], carpetas: [] }

for await (const dirEntry of Deno.readDir(path)) {
  if (dirEntry.isFile) {
    const sn = dirEntry.name.split('.')
    const extension = sn[sn.length - 1]
    archivos.push({ nombre: dirEntry.name, extension })
  } else if (dirEntry.isDirectory) {
    carpetas.push(dirEntry.name)
  }
}
for await (const file of archivos) {
  if (Object.keys(folders).includes(file.extension)) {
    const extension = file.extension as extensiones
    await ensureDirSync(path + folders[extension])
    moveSync(`${path}${file.nombre}`, `${path}${folders[extension]}/${file.nombre}`)
  }
}
console.log('termino')