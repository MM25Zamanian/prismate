import { PrismateService } from "@prismate/service";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { compress } from "hono/compress";
import { etag } from "hono/etag";
import { HTTPException } from "hono/http-exception";

import type { DMMF } from "@prismate/core";
import type { ModelDelegate } from "@prismate/database";
import type { Context } from "hono";

// API Response types
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Environment configuration
const defaultAdminToken = process.env.ADMIN_TOKEN ?? null;

// Type for the router factory parameters
interface RouterConfig<
  TClient extends Record<string, ModelDelegate> | null | undefined,
  TDMMF extends DMMF,
> {
  client: TClient;
  dmmf: TDMMF;
  verifyToken?: (token: string, context: Context) => boolean | Promise<boolean>;
}

// Type for route handler functions
type RouteHandler = (context: Context) => Promise<Response>;

// Router factory
export function createModelRouter<
  TClient extends Record<string, ModelDelegate> | null | undefined,
  TDMMF extends DMMF,
>({
  client,
  dmmf,
  verifyToken = async (token: string) =>
    defaultAdminToken ? token === defaultAdminToken : true,
}: RouterConfig<TClient, TDMMF>) {
  const app = new Hono();
  const service = new PrismateService(client, dmmf);

  // Middlewares
  app.use("*", etag()); // Enable ETag for all routes
  app.use("*", compress()); // Enable compression (gzip/deflate)
  app.use(
    "*",
    bearerAuth({
      verifyToken,
    })
  );

  // Helper: success response
  const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
    success: true,
    data,
  });

  // Helper: error response
  const createErrorResponse = (message: string): ApiResponse => ({
    success: false,
    error: message,
  });

  // Error handler wrapper
  const withErrorHandling =
    (handler: RouteHandler): RouteHandler =>
    async (context: Context): Promise<Response> => {
      try {
        return await handler(context);
      } catch (error: unknown) {
        console.error("❌ API Error:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Operation failed. Please try again.";

        throw new HTTPException(400, {
          message: createErrorResponse(errorMessage).error!,
        });
      }
    };

  // Routes
  app.get("/", (context: Context) => {
    return context.json(
      createSuccessResponse({
        message: "Prismate API",
        version: "0.0.1",
      })
    );
  });
  app.get("/models", (context: Context) => {
    return context.json(
      createSuccessResponse({
        models: service.getAvailableModels(),
      })
    );
  });
  app.get(
    "/models/schema/:model",
    withErrorHandling(async (context: Context) => {
      const model = context.req.param("model");
      if (!model) {
        throw new HTTPException(400, {
          message: "Model parameter is required",
        });
      }

      const schema = service.getModelSchema(model);
      return context.json(createSuccessResponse(schema));
    })
  );
  app.get(
    "/models/schema/:model/fields",
    withErrorHandling(async (context: Context) => {
      const model = context.req.param("model");
      if (!model) {
        throw new HTTPException(400, {
          message: "Model parameter is required",
        });
      }

      const schema = service.getModelFields(model);
      return context.json(createSuccessResponse(schema));
    })
  );
  app.get(
    "/models/:model",
    withErrorHandling(async (context: Context) => {
      const model = context.req.param("model");
      if (!model) {
        throw new HTTPException(400, {
          message: "Model parameter is required",
        });
      }

      const schema = service.getModels(model);
      return context.json(createSuccessResponse(schema));
    })
  );
  app.post(
    "/models/:model",
    withErrorHandling(async (context: Context) => {
      const model = context.req.param("model");
      if (!model) {
        throw new HTTPException(400, {
          message: "Model parameter is required",
        });
      }

      const body = await context.req.json();
      const result = await service.createModel(model, body);
      return context.json(createSuccessResponse(result));
    })
  );

  app.put(
    "/models/:model/:id",
    withErrorHandling(async (context: Context) => {
      const model = context.req.param("model");
      const id = context.req.param("id");

      if (!model || !id) {
        throw new HTTPException(400, {
          message: "Model and ID parameters are required",
        });
      }

      const body = await context.req.json();
      const result = await service.updateModel(model, id, body);
      return context.json(createSuccessResponse(result));
    })
  );

  app.delete(
    "/models/:model/:id",
    withErrorHandling(async (context: Context) => {
      const model = context.req.param("model");
      const id = context.req.param("id");

      if (!model || !id) {
        throw new HTTPException(400, {
          message: "Model and ID parameters are required",
        });
      }

      const result = await service.deleteModel(model, id);
      return context.json(createSuccessResponse(result));
    })
  );

  return app;
}
