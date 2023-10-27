$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {

    //obtem a lista de itens do cardapio//
    obterItensCardapio: (categoria = 'burguers', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden')
        }

        $.each(filtro, (i, e) => {

            console.log(e.name)
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)

            //Paginação ao clicar em ver mais (12 itens)    
            if (vermais && i >= 8 && i < 12) {

                $("#itensCardapio").append(temp)

            }

            //Paginação inicial (8 itens)
            if (!vermais && i < 8) {

                $("#itensCardapio").append(temp)

            }

        })

        //remove o ativo
        $(".container-menu a").removeClass('active');

        //adiciono ativo ao menu
        $("#menu-" + categoria).addClass('active');

    },

    //clique no botão ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true)

        $('#btnVerMais').addClass('hidden');
    },

    //diminuir quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    //aumentar quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    //Adicionar ao carrinho o item do cardapio
    adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            // Obtenha a categoria ativa.
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];
            // Obtenha a lista de itens.
            let filtro = MENU[categoria];
            // Obtenha o item.
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {
                // Valide se já existe esse item no carrinho.
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // Caso já exista o item no carrinho, só altera a quantidade.
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                } else {
                    // Caso não exista o item no carrinho, adicione-o.
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }

                // Retorne o valor da quantidade no cartão para zero.
                cardapio.metodos.mensagem('Item adicionado ao carrinho.', 'green');
                $("#qntd-" + id).text(0);
                cardapio.metodos.atualizarBadgeTotal();
            }
        }
    },

    //atualiza os badges totais dos bbotões meu carrinho
    atualizarBadgeTotal: () => {
        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        } else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);
    },

    //abrir a modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass("hidden");
        } else {
            $("#modalCarrinho").addClass("hidden");
        }
    },


    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();//id's aleatorios

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div> `

        $("#container-mensagens").append(msg);

        setTimeout(() => {

            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);

        }, tempo)
    },
}

cardapio.templates = {


    item: `
        <div class= "col-3 mb-5" >
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>\${preco}</b>
                </p>
                <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `
}
