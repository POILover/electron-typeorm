import { handleErrorToResponse } from '@shared/common/error'
import { ApiResponseFactory } from '@shared/common/response'
import { instanceToPlain } from 'class-transformer'
import { ipcMain } from 'electron'
import { PhotoService } from './photo.services'
export class PhotoController {
  constructor(
    private photoService: PhotoService,
    private ipcMonitor
  ) {
    this.registerIpcHandlers()
  }
  registerIpcHandlers() {
    this.ipcMonitor.wrapIpc()('createPhoto', async (_, photoData) => {
      try {
        const savedPhoto = await this.photoService.createPhoto(photoData)
        return ApiResponseFactory.ok(instanceToPlain(savedPhoto))
      } catch (error) {
        return handleErrorToResponse(error)
      }
    })
  }
}
