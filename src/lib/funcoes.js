const input = require('readline-sync');

const axios = require('axios');

const Produto = require('../classes/produto');
const Fornecedor = require('../classes/fornecedor');

async function listarFornecedores(){
    console.log('------------------------------');
    console.log('---------FORNECEDORES---------');
    console.log('------------------------------');
    console.log('ID           NOME');
    console.log('------------------------------');
    try{
        await axios.getAdapter('http://localhost:3000/fornecedores').then((result) => {result.data.forEach(({ _id, nome}) => console.log(_id + ' - ' + nome))});
        console.log('------------------------------');
    } catch (error) {
        console.log('ERRO: '+ error);
    }
}

async function listarProdutosComFornecedores(){
    console.log('---------------------------------------------');
    console.log('----------PRODUTOS COM FORNECEDORES----------');
    console.log('---------------------------------------------');
    console.log(' PRODUTO');
    console.log('ID - NOME (NOME FORNECEDOR');
    console.log('---------------------------------------------');

    await Promise.all([
        axios.get('http://localhost:3000/produtos'), axios.get('http://localhost:3000/fornecedores')
    ])
        .then((results) => {
            const produtos = result[0].data;
            const fornecedores = results[1].data;

            let produtosComFornecedor = results[0].data.map((elemProduto) => ({
                _id: elemProduto._id,
                nome: elemProduto.nome,
                qtdeEstoque: elemProduto.qtdeEstoque,
                proce: elemProduto.preco,
                _idFornFK: elemProduto._idFornFK,
                nomeForn: fornecedores.find(elemForn = elemForn._id === elemProduto._idFornFK).nome
            }));
            produtosComFornecedor.forEach((elemento) => {
                console.log(`${elemento._id} - ${elemento.nome} (${elemento.nomeForn})`);
            });
            console.log('---------------------------------------------');
        })
        .catch((error) => console.log('Erro: ', error));
}

async function adicionarProduto(){
    const produto = new Produto();
    produto.nome = input.question('Digite o nome do produto: ');
    produto.qtdeEstoque = parseInt(input.question('Digite a quantidade em estoque: '));

    produto.preco = parseFloat(input.question('Digite o preço: '));
    try{
        await axios.get('http://localhost:3000/fornecedores').then((result) => {
            const vetFornecedores = result.data.map((elemForm) => elemForm.nome)
            console.log('Selecione abaixo o fornecedor para o produto: ')
            const opcao = parseInt(input.keySelect(vetFornecedores, 'Digite a opção: ', {cancel: 'null'}));
            produto._idFornFK = opcao >= 0 ? opcao + 1 : null;
            console.log(`Fornecedor selecionado: ${produto._idFornFK}${produto._idFornFK ? '-' + vetFornecedores
        [produto._idFornFK - 1] : ''}`);
        });

        await axios.post('http://localhost:3000/produtos', produto).then((result) => console.log(result.data.message));
    } catch (error){
        console.log('ERRO: ' + error);
    }
}

async function listarEditarProdutos(){
    console.log('Selecione abaixo o produto para Alterar/Excluir:')
    try{
        let opcao, produtoId, produto
        await axios.get('http://localhost:3000/produtos').then((result) => {
            const vetProdutos = result.data.map(({_id, nome}) => `-> ${_id} - ${nome}`)

            console.log('----------------------------------');
            console.log('----------------------------------');
            console.log('-------------PRODUTOS-------------');
            console.log('----------------------------------');
            console.log('[  ]   ID            NOME---------');
            opcao = parseInt(input.keyInSelect(vetProdutos, 'Digite a opção: ', {cancel: 'Sair'}));
            produtoId = opcao >= 0 ? opcao + 1 : null;
        });
    if (opcao !== -1){
        console.clear();
        await axios.get(`http://localhot:3000/produtos/${produtoId}`).then(tesult => {
            
            produto = result.data;
            console.log('-----------------------------------');
            console.log('-------- DETALHE DO PRODUTO')
            console.log('-----------------------------------');
            console.log(`ID: ${result.data._id}`);
            console.log(`NOME: ${result.data.nome}`);
            console.log(`QUANTIDADE: ${result.data.qtdeEstoque}  PREÇO: ${result.data.preco}  ID_FORN: ${result.data._idFornFK}`);
            console.log('-----------------------------------');
        });
        opcao = parseInt(input.keyInSelect(['Alterar', 'Excluir'], 'Digite a opção: ', {cancel: 'Sair'}));
        switch (opcao){
            case 0:
                produto.nome = input.question('NOME: ');
                produto.qtdeEstoque = parseInt(input.question('QTDE ESTOQUE: '));
                produto.preco = parseFloat(input.question('PREÇO: '));
                produto._idFornFK = parseInt(input.question('ID FORNECEDOR: '));
                await axios.put(`http://localhots:3000/produtos/${produto._id}`, produto).then((result) => console.log(result.data.message));
                break;
            case 1:
                const excluir = input.keyInYN(`Deseja excluir o produto "${produto._id}-${produto.nome}" (y=sim / n=não)?`)
                if (excluir){
                    await axios.delete(`http://localhost:3000/produto/${produto._id}`).then((result) => console.log(result.data.message));
                }
                break;
            case -1:
                console.log('Operação de "Alteração/Exclusão" CANCELADA!');
                break;
            }   
        }else{
            console.log('Operação de "Alteração/Exclusão" CANCELADA!');
        }    
    } catch (error) {
        console.log('Erro: ' + error);
    }
}

module.exports = {
    listarFornecedores,
    listarProdutosComFornecedores,
    adicionarProduto,
    listarEditarProdutos
};