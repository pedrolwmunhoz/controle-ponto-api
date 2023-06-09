// user.js

const db = require('../config/dbConfig');

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  //GET Users by name
  static async findByUserName(name) {
    const query = {
      text: 'SELECT * FROM usuarios WHERE nome = $1',
      values: [name],
    };

    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar usuários por nome');
    }
  }

  //Add users
  async save(user) {

    //verificação de usuario existente
    const query = {
        text: 'SELECT * FROM usuarios WHERE nome = $1',
        values: [user.name],
      };
  
      try {
        const result = await db.query(query);
        if (result.rowCount > 0) {
          throw new Error('Usuário já existe');
        }
      } catch (error) {
        console.error(error);
        throw new Error('Erro ao verificar se o usuário já existe');
      }
  
      //Inserção do usuário no banco de dados
      const insertQuery = {
        text: 'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING id',
        values: [user.name, user.email],
      };
  
      try {
        const result = await db.query(insertQuery);
        this.id = result.rows[0].id;
      } catch (error) {
        console.error(error);
        throw new Error('Erro ao inserir usuário no banco de dados');
      }
    }

}

module.exports = User;
