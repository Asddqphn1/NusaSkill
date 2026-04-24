import {
  createCareer,
  deleteCareerById,
  findAllCareers,
  findCareerById,
  findCareerByNameInsensitive,
  updateCareerById,
} from "../repositories/career.repository";
import type {
  CreateCareerInput,
  UpdateCareerInput,
} from "../validator/career.validator";

type CareerStatusCode = 404 | 409;

export class CareerError extends Error {
  status: CareerStatusCode;

  constructor(message: string, status: CareerStatusCode) {
    super(message);
    this.status = status;
  }
}

async function getCareerOrThrow(id: string) {
  const career = await findCareerById(id);
  if (!career) {
    throw new CareerError("Career not found", 404);
  }
  return career;
}

export function listCareers() {
  return findAllCareers();
}

export async function getCareer(id: string) {
  const career = await getCareerOrThrow(id);
  return { career };
}

export async function createCareerService(data: CreateCareerInput) {
  const existing = await findCareerByNameInsensitive(data.name);
  if (existing) {
    throw new CareerError("Career name already exists", 409);
  }

  const career = await createCareer(data);
  return {
    message: "Career created",
    career,
  };
}

export async function updateCareerService(id: string, data: UpdateCareerInput) {
  await getCareerOrThrow(id);

  if (data.name) {
    const existing = await findCareerByNameInsensitive(data.name);
    if (existing && existing.id !== id) {
      throw new CareerError("Career name already exists", 409);
    }
  }

  const career = await updateCareerById(id, data);

  return {
    message: "Career updated",
    career,
  };
}

export async function deleteCareerService(id: string) {
  await getCareerOrThrow(id);
  const career = await deleteCareerById(id);

  return {
    message: "Career deleted",
    career,
  };
}
