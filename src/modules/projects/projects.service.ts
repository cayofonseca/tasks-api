import { Injectable } from '@nestjs/common';
import { ProjectRequestDto } from './projects.dto';

@Injectable()
export class ProjectsService {
  findAll() {
    return ['Teste 1', 'Teste 2'];
  }

  findById(id: string) {
    return 'Teste 1';
  }

  create(data: ProjectRequestDto) {
    return 'create teste1';
  }

  update(id: string, data: ProjectRequestDto) {
    return 'update teste1';
  }

  remove(id: string) {
    return 'remove teste1';
  }
}
