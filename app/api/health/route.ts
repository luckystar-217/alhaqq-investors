// Add Stack Auth and Neon health checks to the health endpoint
import { checkStackAuthHealth } from "@/lib/stack-auth"
import { checkNeonHealth } from "@/lib/neon-db"

export async function GET() {
  try {
    const [stackAuthHealth, neonHealth] = await Promise.all([checkStackAuthHealth(), checkNeonHealth()])

    const overallHealth = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        stackAuth: stackAuthHealth,
        database: neonHealth,
        // ... other service checks
      },
    }

    // Determine overall status
    const isHealthy = stackAuthHealth.configured && stackAuthHealth.canAuthenticate && neonHealth.connected

    if (!isHealthy) {
      overallHealth.status = "degraded"
    }

    return Response.json(overallHealth, {
      status: isHealthy ? 200 : 503,
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
