import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../db';

// ... a função registerUser continua aqui em cima ...
export const registerUser = async (req: Request, res: Response) => {
    // ... código existente sem alterações
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, passwordHash]
        );
        const insertId = (result as any).insertId;
        res.status(201).json({ message: 'User created successfully!', userId: insertId });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already in use.' });
        }
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// NOVA FUNÇÃO
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Validação básica
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // 2. Buscar usuário pelo email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // 401 Unauthorized
    }

    const user = users[0];

    // 3. Comparar a senha enviada com o hash salvo
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 4. Gerar o JWT
    const token = jwt.sign(
      { userId: user.id },
      'SEU_SEGREDO_SUPER_SECRETO', // Em um projeto real, isso viria de uma variável de ambiente!
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // 5. Enviar o token
    res.status(200).json({ message: 'Login successful!', token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};