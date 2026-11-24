import { HttpError } from '../../shared/http-error.js';
import * as tablesRepo from './tables.repository.js';
import type { TableStatus } from './tables.repository.js';

const VALID_STATUSES: readonly TableStatus[] = ['available', 'occupied', 'out_of_service'];

export async function getAllTables() {
  return tablesRepo.listTables();
}

export async function createTable(nameInput: unknown, capacityInput: unknown) {
  if (typeof nameInput !== 'string') {
    throw new HttpError(400, 'INVALID_INPUT', 'El nombre de la mesa es obligatorio');
  }
  const name = nameInput.trim();
  if (name.length === 0 || name.length > 80) {
    throw new HttpError(400, 'INVALID_INPUT', 'El nombre debe tener entre 1 y 80 caracteres');
  }
  if (
    typeof capacityInput !== 'number' ||
    !Number.isInteger(capacityInput) ||
    capacityInput < 1 ||
    capacityInput > 20
  ) {
    throw new HttpError(400, 'INVALID_INPUT', 'La capacidad debe ser un entero entre 1 y 20');
  }

  try {
    return await tablesRepo.insertTable(name, capacityInput);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw new HttpError(409, 'DUPLICATE_TABLE', 'Ya existe una mesa con ese nombre');
    }
    throw error;
  }
}

export async function changeTableStatus(idParam: string, statusInput: unknown) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'INVALID_INPUT', 'El ID de la mesa debe ser un entero positivo');
  }
  if (typeof statusInput !== 'string' || !VALID_STATUSES.includes(statusInput as TableStatus)) {
    throw new HttpError(400, 'INVALID_INPUT', 'Estado de mesa inválido');
  }

  const updated = await tablesRepo.updateTableStatus(id, statusInput as TableStatus);
  if (!updated) {
    throw new HttpError(404, 'TABLE_NOT_FOUND', 'Mesa no encontrada');
  }
  return updated;
}
