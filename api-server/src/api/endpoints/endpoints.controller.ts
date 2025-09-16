import { Request, Response } from 'express';
import pool from '../../db';

// READ (já implementado)
export const getEndpoints = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  try {
    const [rows] = await pool.query(
      'SELECT id, name, url, protocol, created_at FROM monitored_endpoints WHERE user_id = ?',
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching endpoints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// CREATE (já implementado)
export const addEndpoint = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { name, url, protocol } = req.body;
  if (!name || !url || !protocol) {
    return res.status(400).json({ message: 'Name, url, and protocol are required.' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO monitored_endpoints (name, url, protocol, user_id) VALUES (?, ?, ?, ?)',
      [name, url, protocol, userId]
    );
    const insertId = (result as any).insertId;
    res.status(201).json({ 
      message: 'Endpoint added successfully!', 
      endpointId: insertId 
    });
  } catch (error) {
    console.error('Error adding endpoint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// UPDATE (NOVA LÓGICA)
export const updateEndpoint = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params; // ID do endpoint a ser atualizado
  const { name, url, protocol } = req.body;

  if (!name || !url || !protocol) {
    return res.status(400).json({ message: 'Name, url, and protocol are required.' });
  }

  try {
    const [result] = await pool.query(
      // A cláusula WHERE garante que um usuário só pode atualizar seus próprios endpoints
      'UPDATE monitored_endpoints SET name = ?, url = ?, protocol = ? WHERE id = ? AND user_id = ?',
      [name, url, protocol, id, userId]
    );

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      // Isso acontece se o endpoint não existe ou não pertence ao usuário
      return res.status(404).json({ message: 'Endpoint not found or user not authorized.' });
    }

    res.status(200).json({ message: `Endpoint ${id} updated successfully!` });
  } catch (error) {
    console.error(`Error updating endpoint ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
export const deleteEndpoint = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params; // ID do endpoint a ser deletado

  try {
    const [result] = await pool.query(
      'DELETE FROM monitored_endpoints WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Endpoint not found or user not authorized.' });
    }

    res.status(200).json({ message: `Endpoint ${id} deleted successfully!` });
  } catch (error) {
    console.error(`Error deleting endpoint ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};