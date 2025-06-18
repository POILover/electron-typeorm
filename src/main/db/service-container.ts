import { UserService } from "./user/user.services";
function singleton<T>(factory: () => T): () => T {
  let instance: T | undefined
  return () => instance ??= factory()
}

const getUserService = singleton(() => new UserService());

export const serviceContainer = {
    get userService() {
        return getUserService()
    }
}
