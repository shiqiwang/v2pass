/**
 * 使用Folder接口时，前后端都需要引入_id
 */

export default interface Folder {
  name: string;
  describe: string;
  avatar: File;
}
