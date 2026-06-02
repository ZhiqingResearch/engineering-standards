import { Controller, Get, ServiceUnavailableException } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { Public } from "@/common/decorators/public.decorator"
import { SkipResponseTransform } from "@/common/interceptors/response.interceptor"
import { PrismaService } from "@/prisma/prisma.service"

/**
 * 健康检查
 *
 * - 路径为 /health（不带 /api 前缀，见 main.ts 的 setGlobalPrefix exclude）
 * - @Public() 跳过 JWT 校验
 * - @SkipResponseTransform() 保留原始响应结构，k8s/docker 探针通常只看 status code
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @SkipResponseTransform()
  @Get()
  @ApiOperation({ summary: "健康检查" })
  async check() {
    try {
      // 简单连通性探测：Prisma 执行一个最轻量的查询
      await this.prisma.$queryRaw`SELECT 1`
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        db: "up",
      }
    } catch (err) {
      throw new ServiceUnavailableException({
        status: "error",
        timestamp: new Date().toISOString(),
        db: "down",
        message: err instanceof Error ? err.message : String(err),
      })
    }
  }
}
