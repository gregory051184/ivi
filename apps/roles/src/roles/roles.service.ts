import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "@app/common";
import {CreateRoleGTO} from "@app/common";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private readonly roleRepository: typeof Role) {
  }
  async createRole(dto: CreateRoleGTO) {
    const existing_role = await this.getRoleByValue(dto.value);
    if(!existing_role) {
      const new_role = await this.roleRepository.create(dto);
      return new_role;
    }
    throw new HttpException('Такая роль уже существует', HttpStatus.BAD_REQUEST)
  }

  async getAllRoles() {
    const roles = await this.roleRepository.findAll({include: {all: true}});
    return roles;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({where: {value: value}});
    return role;
  }

  async getRoleById(id: string) {
    const role = await this.roleRepository.findByPk(+id);
    return role;
  }

  async updateRole(dto: CreateRoleGTO, role_id: string) {
    const role = await this.roleRepository.update({...dto}, {where: {id: +role_id}});
    return role;
  }

  async deleteRole(role_id: string) {
    const role = await this.roleRepository.destroy({where: {id: +role_id}});
    return role;
  }
}
