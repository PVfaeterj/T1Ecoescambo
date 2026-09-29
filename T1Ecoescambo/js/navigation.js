document.addEventListener('DOMContentLoaded', () => {
    initBuscaCatalogo();
    initBotoesInteresse();
    initFormCadastro();
    carregarItensCatalogo();
    atualizarContador();
});

function initBuscaCatalogo() {
    const inputBusca = document.getElementById('inputBusca');
    const selectOrdem = document.getElementById('selectOrdem');
    const selectCondicao = document.getElementById('selectCondicao');
    const selectRegiao = document.getElementById('selectRegiao');

    function aplicarFiltros() {
        const texto = inputBusca ? inputBusca.value.toLowerCase().trim() : '';
        const ordem = selectOrdem ? selectOrdem.value : '';
        const filtroCond = selectCondicao ? selectCondicao.value : '';
        const filtroReg = selectRegiao ? selectRegiao.value : '';
        
        const rows = document.querySelectorAll('.item-row');

        rows.forEach(row => {
            const rowTexto = row.textContent.toLowerCase();
            const rowCond = row.getAttribute('data-condicao') || '';
            const rowReg = row.getAttribute('data-regiao') || '';

            const matchTexto = rowTexto.includes(texto);
            const matchCond = filtroCond === '' || rowCond === filtroCond;
            const matchReg = filtroReg === '' || rowReg === filtroReg;

            if (matchTexto && matchCond && matchReg) {
                row.classList.remove('oculto');
            } else {
                row.classList.add('oculto');
            }
        });

        const list = document.getElementById('gridCatalogo');
        if (list && ordem !== '') {
            const rowsArray = Array.from(document.querySelectorAll('.item-row'));
            rowsArray.sort((a, b) => {
                const tituloA = a.querySelector('h4').textContent.trim().toLowerCase();
                const tituloB = b.querySelector('h4').textContent.trim().toLowerCase();
                return ordem === 'az' ? tituloA.localeCompare(tituloB) : tituloB.localeCompare(tituloA);
            });
            rowsArray.forEach(row => list.appendChild(row));
        }
    }

    if (inputBusca) inputBusca.addEventListener('input', aplicarFiltros);
    if (selectOrdem) selectOrdem.addEventListener('change', aplicarFiltros);
    if (selectCondicao) selectCondicao.addEventListener('change', aplicarFiltros);
    if (selectRegiao) selectRegiao.addEventListener('change', aplicarFiltros);
}

function initBotoesInteresse() {
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-interesse')) {
            const botao = event.target;
            if (botao.classList.contains('btn-red')) {
                botao.classList.remove('btn-red');
                botao.classList.add('btn-blue');
                botao.textContent = 'Tenho interesse';
            } else {
                botao.classList.remove('btn-blue');
                botao.classList.add('btn-red');
                botao.textContent = 'Remover interesse';
            }
            atualizarContador();
        }
    });
}

function atualizarContador() {
    const spanContador = document.getElementById('numInteresses');
    if (spanContador) {
        const ativos = document.querySelectorAll('.btn-interesse.btn-red').length;
        spanContador.textContent = ativos;
    }
}

function formatarRegiao(regiao) {
    if (regiao === 'centro') return 'Centro';
    if (regiao === 'zonasul') return 'Zona Sul';
    if (regiao === 'zonanorte') return 'Zona Norte';
    if (regiao === 'zonaoeste') return 'Zona Oeste';
    return regiao;
}

function initFormCadastro() {
    const form = document.getElementById('formCadastroProduto');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const nome = document.getElementById('nome').value;
            const descricao = document.getElementById('descricao').value;
            const condicao = document.getElementById('condicao').value;
            const regiao = document.getElementById('regiao').value;
            const fileInput = document.getElementById('imagemFile');

            const concluirCadastro = (imagemBase64) => {
                const novoItem = { nome, descricao, condicao, regiao, imagem: imagemBase64 };
                let produtosSalvos = JSON.parse(localStorage.getItem('produtosEscambo')) || [];
                produtosSalvos.push(novoItem);
                localStorage.setItem('produtosEscambo', JSON.stringify(produtosSalvos));
                
                alert('Anúncio cadastrado com sucesso!');
                window.location.href = 'catalogo.html';
            };

            if (fileInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(e) { concluirCadastro(e.target.result); };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                concluirCadastro('https://via.placeholder.com/100');
            }
        });
    }
}

function carregarItensCatalogo() {
    const list = document.getElementById('gridCatalogo');
    if (list) {
        let produtosSalvos = JSON.parse(localStorage.getItem('produtosEscambo')) || [];
        produtosSalvos.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item-row';
            div.setAttribute('data-condicao', item.condicao || '');
            div.setAttribute('data-regiao', item.regiao || '');
            
            const textoCondicao = item.condicao === 'novo' ? 'Novo' : 'Usado';
            const textoRegiao = formatarRegiao(item.regiao);

            div.innerHTML = `
                <img src="${item.imagem}" alt="Produto">
                <div class="item-info">
                    <h4>${item.nome}</h4>
                    <p>Condição: ${textoCondicao} | Região: ${textoRegiao}</p>
                    <p>Aceita: ${item.descricao}</p>
                </div>
                <button class="btn-blue btn-interesse">Tenho interesse</button>
            `;
            list.appendChild(div);
        });
    }
}
