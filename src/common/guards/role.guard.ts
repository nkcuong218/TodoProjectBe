import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/role.decorator";
import { Role } from "../enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ]
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    const user = request.user;

    return requiredRoles.includes(user.role);
  }
}

