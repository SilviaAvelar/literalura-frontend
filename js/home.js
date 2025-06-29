import {
    getTodosLivros,
    buscarESalvarLivroPorTitulo,
    getLivrosPorIdioma,
    getTodosAutores,
    getAutoresVivosEmAno,
    getTop10Livros,
    getEstatisticas,
    getAutoresPorNome
} from './apiService.js';

const TAMANHO_PAGINA_AUTORES = 8;

// --- FUNÇÕES DE RENDERIZAÇÃO ---

function criarCardLivro(livro) {
    const card = document.createElement('div');
    card.className = 'card-livro';

    if (livro.posterUrl) {
        const img = document.createElement('img');
        img.src = livro.posterUrl;
        img.alt = `Capa de ${livro.titulo}`;
        card.appendChild(img);
    } else {
        const noImageP = document.createElement('p');
        noImageP.className = 'sem-imagem';
        noImageP.textContent = '[Sem capa disponível]';
        card.appendChild(noImageP);
    }

    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';

    const h3 = document.createElement('h3');
    const linkTitulo = document.createElement('a');
    linkTitulo.href = `detalhes_livro.html?id=${livro.id}`;
    linkTitulo.textContent = livro.titulo;
    h3.appendChild(linkTitulo);
    cardInfo.appendChild(h3);

    const pAutor = document.createElement('p');
    pAutor.textContent = `Autor: ${livro.autor ? livro.autor.nome : 'Desconhecido'}`;
    cardInfo.appendChild(pAutor);

    const pIdioma = document.createElement('p');
    pIdioma.textContent = `Idioma: ${livro.idioma || 'N/A'}`;
    cardInfo.appendChild(pIdioma);

    const pDownloads = document.createElement('p');
    pDownloads.textContent = `Downloads: ${livro.numeroDownloads != null ? livro.numeroDownloads : 0}`;
    cardInfo.appendChild(pDownloads);

    card.appendChild(cardInfo);

    return card;
}

function criarCardAutor(autor) {
    const card = document.createElement('div');
    card.className = 'card-autor'; 
    card.innerHTML = `
        <h3>${autor.nome}</h3>
        <p><b>Nascimento:</b> ${autor.anoNascimento || 'N/A'}</p>
        <p><b>Falecimento:</b> ${autor.anoFalecimento || 'Vivo(a)'}</p>
    `;
    return card;
}

function renderizarLista(container, dados, criarCardFn, mensagemSemDados) {
    container.innerHTML = ''; 
    if (dados && dados.length > 0) {
        dados.forEach(item => container.appendChild(criarCardFn(item)));
    } else {
        container.innerHTML = `<p class="info-message">${mensagemSemDados}</p>`;
    }
}

function renderizarPaginacao(container, pageObject, onPageChange) {
    container.innerHTML = '';
    if (!pageObject || pageObject.totalPages <= 1) return; 

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Página ${pageObject.number + 1} de ${pageObject.totalPages}`;

    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'Anterior';
    btnAnterior.disabled = pageObject.first;
    btnAnterior.addEventListener('click', () => onPageChange(pageObject.number - 1));

    const btnProximo = document.createElement('button');
    btnProximo.textContent = 'Próximo';
    btnProximo.disabled = pageObject.last;
    btnProximo.addEventListener('click', () => onPageChange(pageObject.number + 1));

    container.append(btnAnterior, pageInfo, btnProximo);
}


document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REFERÊNCIAS AO DOM ---
    const listaLivrosContainer = document.getElementById('lista-livros-container');
    const livrosPaginationContainer = document.getElementById('livros-pagination-controls');
    const listaAutoresContainer = document.getElementById('lista-autores-container');
    const autoresPaginationContainer = document.getElementById('autores-pagination-controls');
    const inputTituloLivro = document.getElementById('input-titulo-livro');
    const btnBuscarLivro = document.getElementById('btn-buscar-livro');
    const resultadoBuscaContainer = document.getElementById('resultado-busca-container');
    const selectIdioma = document.getElementById('select-idioma');
    const top10Container = document.getElementById('top10-container');
    const statsContainer = document.getElementById('stats-container');
    const inputAnoVivo = document.getElementById('input-ano-vivo');
    const btnFiltrarAutoresAno = document.getElementById('btn-filtrar-autores-ano');
    const inputNomeAutor = document.getElementById('input-nome-autor');
    const btnBuscarAutorNome = document.getElementById('btn-buscar-autor-nome');
    const btnLimparFiltrosAutores = document.getElementById('btn-limpar-filtros-autores');


    // --- 2. ESTADO DA APLICAÇÃO ---
    let estado = {
        livros: { currentPage: 0, filtro: 'todos' },
        autores: { currentPage: 0, tipoFiltro: 'todos', valorFiltro: '' }
    };

    // --- 3. FUNÇÕES DE CARREGAMENTO ---
    async function carregarLivros() {
        listaLivrosContainer.innerHTML = '<p class="loading-message">Carregando livros...</p>';
        livrosPaginationContainer.innerHTML = '';
        try {
            const idioma = estado.livros.filtro;
            const pagina = (idioma === 'todos')
                ? await getTodosLivros(estado.livros.currentPage)
                : await getLivrosPorIdioma(idioma, estado.livros.currentPage);
            renderizarLista(listaLivrosContainer, pagina.content, criarCardLivro, 'Nenhum livro encontrado.');
            renderizarPaginacao(livrosPaginationContainer, pagina, (newPage) => {
                estado.livros.currentPage = newPage;
                carregarLivros();
            });
        } catch (error) {
            listaLivrosContainer.innerHTML = `<p class="error-message">Falha ao carregar livros.</p>`;
        }
    }

    async function carregarAutores() {
        listaAutoresContainer.innerHTML = '<p class="loading-message">Carregando autores...</p>';
        autoresPaginationContainer.innerHTML = '';
        try {
        let pagina;
        const tipo = estado.autores.tipoFiltro;
        const valor = estado.autores.valorFiltro;
        const page = estado.autores.currentPage;

        if (tipo === 'ano') {
            pagina = await getAutoresVivosEmAno(valor, page, TAMANHO_PAGINA_AUTORES); 
        } else if (tipo === 'nome') {
            pagina = await getAutoresPorNome(valor, page, TAMANHO_PAGINA_AUTORES); 
        } else { // 'todos'
            pagina = await getTodosAutores(page, TAMANHO_PAGINA_AUTORES); 
        }

            renderizarLista(listaAutoresContainer, pagina.content, criarCardAutor, 'Nenhum autor encontrado.');
            renderizarPaginacao(autoresPaginationContainer, pagina, (newPage) => {
                estado.autores.currentPage = newPage;
                carregarAutores();
            });
        } catch (error) {
            listaAutoresContainer.innerHTML = `<p class="error-message">Falha ao carregar autores.</p>`;
        }
    }

    async function carregarTop10() {
        top10Container.innerHTML = '<p class="loading-message">Carregando Top 10...</p>';
        try {
            const top10Livros = await getTop10Livros();
            renderizarLista(top10Container, top10Livros, criarCardLivro, 'Não foi possível carregar o Top 10.');
        } catch (error) {
            top10Container.innerHTML = `<p class="error-message">Falha ao carregar o Top 10.</p>`;
        }
    }

    async function carregarEstatisticas() {
        statsContainer.innerHTML = '<p class="loading-message">Carregando estatísticas...</p>';
        try {
            const stats = await getEstatisticas();
            if (stats) {
                statsContainer.innerHTML = `
                    <ul class="stats-list">
                        <li><strong>Total de Livros Analisados:</strong> ${stats.totalLivros}</li>
                        <li><strong>Média de Downloads:</strong> ${stats.mediaDownloads.toFixed(2)}</li>
                        <li><strong>Livro Mais Popular (Downloads):</strong> ${stats.maxDownloads.toLocaleString('pt-BR')}</li>
                        <li><strong>Livro Menos Popular (Downloads):</strong> ${stats.minDownloads.toLocaleString('pt-BR')}</li>
                        <li><strong>Soma Total de Downloads:</strong> ${stats.somaDownloads.toLocaleString('pt-BR')}</li>
                    </ul>
                `;
            } else {
                statsContainer.innerHTML = '<p class="info-message">Não há dados suficientes para calcular as estatísticas.</p>';
            }
        } catch (error) {
            statsContainer.innerHTML = `<p class="error-message">Falha ao carregar as estatísticas.</p>`;
        }
    }

    // --- 4. LÓGICA DE EVENTOS (Ações do usuário que mudam o 'estado' e recarregam os dados) ---
    btnBuscarLivro.addEventListener('click', async () => {
        const titulo = inputTituloLivro.value.trim();
        if (!titulo) return;
        btnBuscarLivro.disabled = true;
        btnBuscarLivro.textContent = 'Buscando...';
        resultadoBuscaContainer.innerHTML = '<p class="loading-message">Buscando na API...</p>';
        try {
            const livroProcessado = await buscarESalvarLivroPorTitulo(titulo);
            if (livroProcessado) {
                resultadoBuscaContainer.innerHTML = '<h4>Livro encontrado e salvo/atualizado:</h4>';
                const gridContainer = document.createElement('div');
                gridContainer.className = 'lista-container'; 
                gridContainer.appendChild(criarCardLivro(livroProcessado));
                resultadoBuscaContainer.appendChild(gridContainer);
            }
        } finally {
            btnBuscarLivro.disabled = false;
            btnBuscarLivro.textContent = 'Buscar na API';
        }
    });

    selectIdioma.addEventListener('change', () => {
        estado.livros.filtro = selectIdioma.value;
        estado.livros.currentPage = 0;
        carregarLivros();
    });

    btnFiltrarAutoresAno.addEventListener('click', () => {
        const ano = inputAnoVivo.value;
        if (!ano || ano < 1) return;
        estado.autores.tipoFiltro = 'ano';
        estado.autores.valorFiltro = ano;
        estado.autores.currentPage = 0;
        carregarAutores();
    });

    btnBuscarAutorNome.addEventListener('click', () => {
        const nome = inputNomeAutor.value.trim();
        if (!nome) return;
        estado.autores.tipoFiltro = 'nome';
        estado.autores.valorFiltro = nome;
        estado.autores.currentPage = 0;
        carregarAutores();
    });

    btnLimparFiltrosAutores.addEventListener('click', () => {
        inputAnoVivo.value = '';
        inputNomeAutor.value = '';
        estado.autores.tipoFiltro = 'todos';
        estado.autores.valorFiltro = '';
        estado.autores.currentPage = 0;
        carregarAutores();
    });

    // --- 5. CARGA INICIAL ---
    carregarEstatisticas();
    carregarTop10();
    carregarLivros();
    carregarAutores();
});