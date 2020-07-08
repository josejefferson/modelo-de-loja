
// const Pessoas = sequelize.define('pessoas', {
// 	nome: Sequelize.STRING,
// 	idade: Sequelize.STRING,
// 	endereco: Sequelize.STRING
// })

// const Objetos = sequelize.define('objetos', {
// 	nome: Sequelize.STRING,
// 	idDoDono: Sequelize.INTEGER
// })

// const objeto = await Objetos.findOne({
// 	where: { id: 1 }
// })
var a =



{
	nome: "Caneta",
	idDoDono: 5,
	dono: {
		nome: "Jefferson Dantas",
		idade: 16,
		endereco: "Endereço Tal..."
	}
}


TABELA pessoas
+----+--------------+-------+-----------------+
| id |         nome | idade | endereco        |
+----+--------------+-------+-----------------+
|  5 | Jefferson... |    16 | Endereço tal... |


TABELA objetos
+----+--------------+----------+
| id |         nome | idDoDono |
+----+--------------+----------+
|  1 | Caneta       |    5     |




