import { app, protocol } from 'electron'
import path from 'path'
import fs from 'fs/promises'
import mime from 'mime-types'

// 统一处理静态资源
async function serveStaticFile(filePath: string): Promise<Response> {
  try {
    const data = await fs.readFile(filePath)
    const mimeType = mime.lookup(filePath) || 'application/octet-stream'
    return new Response(data, {
      headers: { 'Content-Type': mimeType }
    })
  } catch {
    return new Response('Not Found', { status: 404 })
  }
}

// 获取安全的文件路径，防止目录遍历攻击
// 所谓的安全指的是，生成的路径是在baseDir的目录下，也就是说输入的路径经过relative后，不能相对于baseDir出现../形式的回退
// !path.isAbsolute(relativePath)作为额外的安全检查, 确保不会出现本身应该是相对路径, 结果却是绝对路径, 这是一种边界情况, 例如baseDir不合法或者是个空串
type SafePath = string | undefined
function getSafePath(baseDir: string, inputPath: string): SafePath {
  // resolve和join不太一样, 如果是resolve(/xxx/, /uploads/), 会直接返回/uploads/, 如果是join, 它会直接做拼接
  // 因为resolve是以前者作为baseDir, 相对于后者的完整路径, 但此时后者是一个绝对路径, 所以它会返回这个绝对路径本身
  // 如果是./uploads/ 或者 uploads/, 则它们返回的是一样的
  const resolvedPath = path.resolve(baseDir, decodeURIComponent(inputPath.replace(/^\/+/, '')))
  const resolvedBase = path.resolve(baseDir)
  const relativePath = path.relative(resolvedBase, resolvedPath)
  const isSafe = !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
  return isSafe ? resolvedPath : undefined
}

type ProtocolHandler = {
  register?: () => void
  install?: () => void
}

export type CustomProtocol = 'app' | 'http'

type ProtocolMap = Record<CustomProtocol, ProtocolHandler>

const customProtocolMap: ProtocolMap = {
  app: {
    register: () => {
      protocol.registerSchemesAsPrivileged([
        {
          scheme: 'app',
          privileges: {
            secure: true,
            standard: true
          }
        }
      ])
    },
    install: () => {
      protocol.handle('app', async (request) => {
        const url = new URL(request.url)
        let safeFilePath: SafePath

        if (url.pathname.startsWith('/uploads/')) {
          // 拦截 /uploads/ 请求
          const uploadsPath = path.resolve(app.getPath('userData'), 'uploads')
          safeFilePath = getSafePath(uploadsPath, url.pathname.replace(/^\/uploads\//, ''))
        } else {
          // 默认访问 renderer 中的资源
          const rendererRoot = path.resolve(__dirname, '../renderer')
          safeFilePath = getSafePath(rendererRoot, url.pathname)
        }

        if (safeFilePath === undefined) {
          return new Response(`Forbidden ${url.pathname}`, { status: 403 })
        }
        return serveStaticFile(safeFilePath)
      })
    }
  },
  http: {
    install: () => {
      protocol.handle('http', async (request) => {
        const url = new URL(request.url)
        // 拦截 /uploads/ 请求
        if (url.pathname.startsWith('/uploads/')) {
          const uploadsPath = path.resolve(app.getPath('userData'), 'uploads')
          const safeFilePath = getSafePath(uploadsPath, url.pathname.replace(/^\/uploads\//, ''))
          if (safeFilePath === undefined) {
            return new Response('Forbidden', { status: 403 })
          }
          return serveStaticFile(safeFilePath)
        }
        return fetch(request)
      })
    }
  }
}

export const registerCustomProtocol = (protocol: CustomProtocol) => {
  const { register } = customProtocolMap[protocol]
  register?.()
}
export const installCustomProtocol = (protocol: CustomProtocol) => {
  const { install } = customProtocolMap[protocol]
  install?.()
}
