import { SetMetadata } from '@nestjs/common';
import { VALIDATE_RESOURCES_IDS_KEY } from '../../consts';

export const ValidateResourcesId = (...args: string[]) =>
  SetMetadata(VALIDATE_RESOURCES_IDS_KEY, args);
