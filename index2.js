const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let produtos = [
    {_id: 1, nome: 'Tijolo', qtdeEstoque: 1000, preco: 0.90, _idFornFK: 1},
    {_id: 2, nome: 'Cimento', qtdeEstoque: 200, preco: 25.00, _idFornFK: 2},
];

class Produto {
    constructor(id, nome, qtdeEstoque, preco, _idFornFK){
        this._id = id;
        this.nome = nome;
        this.qtdeEstoque = qtdeEstoque;
        this.preco = preco;
        this._idFornFK
    }
}

app.get('/', (req,res, next) => {
    res.json({apiName: 'Catálogo de Produtos!', greetingMessage: 'Bem-Vindo!'});
})

app.get('/fornecedores', (req, res, next) => {res.json(fornecedores);})

app.post('/produtos', (req, res, next) => {
    try {
        if (req.body.nome){
            const {nome, qtdeEstoque, preco, _idFornFK} = req.body;
            const id = produtos.length > 0 ? produtos[produtos.length - 1]._id + 1:1;

            const novoProduto = new Produto(id, nome, qtdeEstoque, preco, _idFornFK);

            produtos.push(novoProduto);
            res.json({message: 'Produto cadastrado com suceso!'});
        } else {
            res.json({ message: 'Dados incorretos. NÃO FOI POSSIVEL cadastrar o produto!'});
        }
    } catch (error){
        res.status(400).json({ erro: `${error}`});
    }
})

app.get('/produtos', (req, res, next) => { res.json(produtos); })

app.get('/produtos/:id', (req, res, next) => {
    try {
        if (req.params.id) {
            const id = parseInt(req.params.id);

            const produto = produtos.find(elemento => elemento._id === id);
            if (produto) {
                res.json(produto);
            }
            else {
                res.json({ message: 'Produto não encontrado!' });
            }       
        }
    } catch (error) {
        res.status(400).json({ erro: `${error}` });
    }
})

app.put('/produtos/:id', (req, res, next) => {
    try {
        if(req.params.id) {
            const id = parseInt(req.params.id);
            const {nome, qtdeEstoque, preco, _idFornFK } = req.body;

            const produto = produtos.find(elemento => elemento._id === id);

            if(produto) {
                produto.nome = nome;
                produto.qtdeEstoque = qtdeEstoque;
                produto.preco = preco;
                produto._idFornFK = _idFornFK;
                res.json({ message: 'Produto alterado com sucesso!'});
            } else {
                res.json({ messsage: 'Produto não encontrado!'});
            }
        }
    } catch (error) {
        res.status(400).json({ erro: `${error}` });
    }
})

app.delete('/produtos/:id', (req, res, next) => {
    try {
        if(req.params.id){            
                const id = parseInt(req.params.id);
                produtos = produtos.filter((elemento) => elemento._id !== id);
                console.log("pdorutos: ", JSON.stringify(produtos));
                res.json({ message: 'Produto excluído com sucesso!'});
            }
            else{
                res.json({ message: 'Dados incorretos. NÃO FOI POSSÍVEL excluir o produto!'});
            }        
    } catch (error){
        res.status(400).json({erro: `${error}`});
    }
})

app.listen(port, 
    () => console.log(`API "Catalogo de Produtos" rodando na porta ${port}`)
);