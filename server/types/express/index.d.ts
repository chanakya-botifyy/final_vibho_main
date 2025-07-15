declare global {
  namespace Express {
    interface User {
      id: string;
      tenantId: string;
      role?: string;
    }

    interface Request {
      user?: User;
    }
  }
}
