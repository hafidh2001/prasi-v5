import {join} from 'path'
export const dir = {
  root: (path:string) => {
    return join(process.cwd(), path);
  },
  data: (path:string) => {}
}