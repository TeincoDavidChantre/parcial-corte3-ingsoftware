import { Router } from 'express';
import * as tablesService from './tables.service.js';

export const tablesRouter = Router();

tablesRouter.get('/', async (_req, res, next) => {
  try {
    const tables = await tablesService.getAllTables();
    res.status(200).json(tables);
  } catch (error) {
    next(error);
  }
});

tablesRouter.post('/', async (req, res, next) => {
  try {
    const { name, capacity } = (req.body ?? {}) as Record<string, unknown>;
    const created = await tablesService.createTable(name, capacity);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

tablesRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = (req.body ?? {}) as Record<string, unknown>;
    const updated = await tablesService.changeTableStatus(req.params.id, status);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});
