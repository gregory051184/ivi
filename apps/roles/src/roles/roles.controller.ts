import { Controller} from '@nestjs/common';
import { RolesService } from './roles.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";

@Controller('/api/v1/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({cmd: "role-registration"})
  async create_role(@Ctx() context: RmqContext, @Payload() payload) {
    return await this.rolesService.create_role(payload.dto);
  }

  @MessagePattern({cmd: "get-all-roles"})
  async getAllRoles() {
    const roles = await this.rolesService.getAllRoles();
    return roles;
  }

  @MessagePattern({cmd: "get-role-by-value"})
  async getRoleByValue(@Ctx() context: RmqContext, @Payload() payload) {
    console.log(payload)
    const value = payload['role_value']
    const role = await this.rolesService.getRoleByValue(value);
    if(role) {
      return role;
    }
    return {message: `Роли ${value} не существует`}
  }

  @MessagePattern({cmd: "get-role-by-id"})
  async getRoleById(@Ctx() context: RmqContext, @Payload() payload) {
    const role = await this.rolesService.getRoleById(payload.id);
    return role;
  }

  @MessagePattern({cmd: "update-role"})
  async update_role(@Ctx() context: RmqContext, @Payload() payload) {
    const role = await this.rolesService.updateRole(payload.dto, payload.id);
    return role;
  }

  @MessagePattern({cmd: "delete-role"})
  async delete_role(@Ctx() context: RmqContext, @Payload() payload) {
    const role = await this.rolesService.deleteRole(payload.id);
    return role;
  }
}