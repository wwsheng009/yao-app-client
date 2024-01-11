import fs from "fs";
import path from "path";
import mime from "mime";
import { YaoClient } from "./client";
// export enum FSSAPCE {
//   system = "system",
//   script = "script",
//   dsl = "dsl",
// }
/**
 * 使用 FS 对象实现文件操作。 Yao 提供 System, DSL, Script 三个空间,
 * System 用于应用数据操作,
 * DSL 用于DSL文件操作,
 * Script 用于脚本文件操作;
 * DSL 和 Script 只能用于 stuido 脚本。
 *
 * let fs = new FS("system");
 *
 * let data = fs.ReadFile("/f1.txt"); // /data/app/data/f1.txt
 */

export class FS extends YaoClient {
  // [key: string]: any;
  space: "system" | "dsl" | "script";
  isLocal: boolean;
  basePath: string;
  /**
   * system	/data/app/data	应用数据
   * dsl	/data/app	除 scripts 外的所有目录(仅 Studio 脚本可用)
   * script	/data/app/scirpts	脚本目录(仅 Studio 脚本可用)
   * @param space
   */
  constructor(space: "system" | "dsl" | "script") {
    super()
    if (!space) {
      throw Error(`文件操作需要指定一个参数:"system" | "dsl" | "script"`);
    }
    this.basePath = "./";
    this.space = space;
    let yao_app_root = process.env.YAO_APP_ROOT;
    if (!yao_app_root) {
      yao_app_root = "./";
    }

    this.isLocal = false;
    switch (this.space) {
      case "system":
        yao_app_root = path.resolve(path.join(yao_app_root, "data", path.sep));
        if (fs.existsSync(yao_app_root)) {
          this.basePath = yao_app_root;
          this.isLocal = true;
        }
        break;
      case "script":
        yao_app_root = path.resolve(
          path.join(yao_app_root, "scripts", path.sep)
        );
        if (fs.existsSync(yao_app_root)) {
          this.basePath = yao_app_root;
          this.isLocal = true;
        }
        this.basePath = path.join(yao_app_root, "scripts", path.sep);
        break;
      case "dsl":
        yao_app_root = path.resolve(yao_app_root);
        if (fs.existsSync(yao_app_root)) {
          this.basePath = path.join(yao_app_root, path.sep);
          this.isLocal = true;
        }
        break;
      default:
        break;
    }
  }
  ReadFile(src: string) {
    if (this.isLocal) {
      let fpath = path.join(this.basePath, src);

      return fs.readFileSync(fpath, "utf8");
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "ReadFile",
      args: [src],
    });
  }
  ReadFileBuffer(src: string) {
    if (this.isLocal) {
      return fs.readFileSync(path.join(this.basePath, src));
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "ReadFileBuffer",
      args: [src],
    });
  }
  WriteFile(src: string, str: any, mode?: number) {
    if (this.isLocal) {
      const fname = path.join(this.basePath, src);
      makeParentFolder(fname);
      return fs.writeFileSync(fname, str, { mode });
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "WriteFile",
      args: [src, str, mode],
    });
  }
  WriteFileBuffer(
    src: string,
    buffer: string | NodeJS.ArrayBufferView,
    mode?: number
  ) {
    if (this.isLocal) {
      const fname = path.join(this.basePath, src);
      makeParentFolder(fname);
      return fs.writeFileSync(fname, buffer, { mode });
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "WriteFileBuffer",
      args: [src, buffer, mode],
    });
  }
  ReadDir(src: string, recursive?: boolean) {
    if (this.isLocal) {
      if (recursive) {
        return readDirAll(this.basePath, path.join(this.basePath, src));
      } else {
        return readDir(this.basePath, path.join(this.basePath, src));
      }
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "ReadDir",
      args: [src, recursive],
    });
  }
  Mkdir(src: string, mode?: number) {
    if (this.isLocal) {
      return fs.mkdirSync(path.join(this.basePath, src), { mode });
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "Mkdir",
      args: [src, mode],
    });
  }
  /**
   * 根据目录，创建必须的目录
   * @param src 目录
   * @param mode 目录权限
   * @returns
   */
  MkdirAll(src: string, mode?: number) {
    if (this.isLocal) {
      return fs.mkdirSync(path.join(this.basePath, src), {
        recursive: true,
        mode,
      });
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "MkdirAll",
      args: [src, mode],
    });
  }
  /**
   * 创建一个临时目录，该目录具有唯一的、随机生成的名称，并且只能由当前用户访问
   * @param src 目录
   * @param pattern 指定临时目录的前缀
   * @returns 创建的临时目录的路径
   */
  MkdirTemp(src: string, pattern?: string) {
    if (this.isLocal) {
      fs.mkdirSync(path.join(this.basePath, src), { recursive: true });
      let newpath = path.join(
        path.join(this.basePath, src),
        pattern ? pattern : ""
      );
      return fs.mkdtempSync(newpath);
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "MkdirTemp",
      args: [src, pattern],
    });
  }
  Exists(src: string) {
    if (this.isLocal) {
      return fs.existsSync(path.join(this.basePath, src));
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "Exists",
      args: [src],
    });
  }
  IsDir(src: string) {
    if (this.isLocal) {
      const stat = fs.statSync(path.join(this.basePath, src));
      return stat.isDirectory();
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "IsDir",
      args: [src],
    });
  }
  IsFile(src: string) {
    if (this.isLocal) {
      const stat = fs.statSync(path.join(this.basePath, src));
      return stat.isFile();
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "IsFile",
      args: [src],
    });
  }
  Remove(src: string) {
    if (this.isLocal) {
      rmoveLocal(path.join(this.basePath, src));
      return;
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "Remove",
      args: [src],
    });
  }
  RemoveAll(src: string) {
    if (this.isLocal) {
      rmoveLocal(path.join(this.basePath, src));
      return;
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "RemoveAll",
      args: [src],
    });
  }
  Chmod(src: string, mode: number) {
    if (this.isLocal) {
      return fs.chmodSync(path.join(this.basePath, src), mode);
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "Chmod",
      args: [src, mode],
    });
  }
  BaseName(src: string) {
    if (this.isLocal) {
      return path.basename(path.join(this.basePath, src));
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "BaseName",
      args: [src],
    });
  }
  DirName(src: string) {
    if (this.isLocal) {
      return path.dirname(path.join(this.basePath, src));
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "DirName",
      args: [src],
    });
  }
  ExtName(src: string) {
    if (this.isLocal) {
      return path.extname(path.join(this.basePath, src));
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "ExtName",
      args: [src],
    });
  }
  MimeType(src: string) {
    if (this.isLocal) {
      return mime.getType(path.join(this.basePath, src));
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "MimeType",
      args: [src],
    });
  }
  Mode(src: string) {
    if (this.isLocal) {
      const stat = fs.statSync(path.join(this.basePath, src));
      return stat.mode;
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "Mode",
      args: [src],
    });
  }
  Size(src: string) {
    if (this.isLocal) {
      const stat = fs.statSync(path.join(this.basePath, src));
      return stat.size;
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "Size",
      args: [src],
    });
  }
  ModTime(src: string) {
    if (this.isLocal) {
      const stat = fs.statSync(path.join(this.basePath, src));
      return stat.mtime;
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "ModTime",
      args: [src],
    });
  }
  Copy(src: string, target: string) {
    if (this.isLocal) {
      return localCopy(
        path.join(this.basePath, src),
        path.join(this.basePath, target)
      );
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "Copy",
      args: [src, target],
    });
  }
  Move(src: string, target: string) {
    if (this.isLocal) {
      const old = path.join(this.basePath, src);
      const newPath = path.join(this.basePath, target);
      return fs.renameSync(old, newPath);
    }
    return this.client.request({}, {
      type: "FileSystem",
      method: "Move",
      args: [src, target],
    });
  }
}

function readDir(base: string, dir: string) {
  let files: string[] = [];
  fs.readdirSync(dir).forEach((file) => {
    const src = `${dir}${path.sep}${file}`;
    files.push(`/${src.replace(base, "")}`);
  });
  return files;
}

/**
 * 读取目录下所有的文件列表，包含子目录
 * @param dir 目录
 * @returns 目录所有的文件列表，包含子目录
 */
function readDirAll(base: string, dir: string): string[] {
  const files: string[] = [];
  for (const fileName of fs.readdirSync(dir)) {
    const filePath = path.join(dir, fileName);
    files.push(`/${filePath.replace(base, "")}`);
    if (fs.statSync(filePath).isDirectory()) {
      files.push(...readDirAll(base, filePath));
    }
  }
  return files;
}

function rmoveLocal(srcPath: string) {
  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(srcPath);
    files.forEach((file) => {
      fs.unlinkSync(`${path}${path.sep}${file}`);
    });
  } else {
    fs.unlinkSync(srcPath);
  }
}

function localCopy(src: string, target: string) {
  const stat = fs.statSync(src);
  if (!stat.isDirectory()) {
    makeParentFolder(target);
    fs.copyFileSync(src, target);
  } else {
    let files = fs.readdirSync(src);
    files.forEach((file) => {
      // Source file
      const srcFile = `${src}${path.sep}${file}`;
      // Destination file
      const destFile = `${target}${path.sep}${file}`;
      localCopy(srcFile, destFile);
    });
  }
}

function makeParentFolder(target: string) {
  const parentFolder = path.dirname(target);
  if (!fs.existsSync(parentFolder)) {
    fs.mkdirSync(parentFolder, { recursive: true });
  }
}
