import { ipcMain } from "electron";
import { instanceToPlain } from "class-transformer"; // class-transformer用于将类实例转换为普通对象
import { UserService } from "./user.services";

export class UserController {
    constructor(private userService: UserService) {
        this.registerIpcHandlers();
    }

    registerIpcHandlers(){
        ipcMain.handle('getUserAndPhotos', async (_, id: number) => {
            const userPhotoData = this.userService.getUserAndPhotos(id);
            return instanceToPlain(userPhotoData); // 来自 class-transformer 的 instanceToPlain 方法, 这类转换方法会调用内部序列化方法, 解析并应用实体类中的装饰器
        })
    }
}