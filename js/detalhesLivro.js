// Importa a função necessária do serviço de API
import { getLivroDetalhes } from './apiService.js';

// --- FUNÇÕES AUXILIARES DE RENDERIZAÇÃO ---

/**
 * Cria e retorna o elemento HTML para a seção de detalhes do livro.
 * @param {object} livro 
 * @returns {HTMLElement} 
 */
function criarEstruturaDetalhes(livro) {
    // Cria o container principal
    const container = document.createElement('div');
    container.className = 'detalhes-livro';

    // Coluna do poster
    const posterDiv = document.createElement('div');
    posterDiv.className = 'detalhes-livro-poster';
    const posterImg = document.createElement('img');
    posterImg.src = livro.posterUrl || './assets/images/placeholder.png';
    posterImg.alt = `Capa de ${livro.titulo}`;
    posterDiv.appendChild(posterImg);

    // Coluna de informações
    const infoDiv = document.createElement('div');
    infoDiv.className = 'detalhes-livro-info';
    
    const titulo = document.createElement('h2');
    titulo.textContent = livro.titulo;

    const autor = document.createElement('p');
    autor.innerHTML = `<b>Autor:</b> ${livro.autor ? livro.autor.nome : 'Desconhecido'}`;

    const idioma = document.createElement('p');
    idioma.innerHTML = `<b>Idioma:</b> ${livro.idioma}`;

    const downloads = document.createElement('p');
    downloads.innerHTML = `<b>Downloads:</b> ${livro.numeroDownloads.toLocaleString('pt-BR')}`;
    
    const topicosContainer = document.createElement('div');
    topicosContainer.className = 'topicos-container';
    
    const topicosTitulo = document.createElement('p');
    topicosTitulo.innerHTML = '<b>Tópicos:</b>';
    topicosContainer.appendChild(topicosTitulo);

    if (livro.topicos && livro.topicos.length > 0) {
        livro.topicos.forEach(nomeTopico => {
            const badge = document.createElement('span');
            badge.className = 'topico-badge';
            badge.textContent = nomeTopico;
            topicosContainer.appendChild(badge);
        });
    } else {
        const semTopicos = document.createElement('span');
        semTopicos.className = 'sem-topicos';
        semTopicos.textContent = 'Nenhum tópico disponível.';
        topicosContainer.appendChild(semTopicos);
    }
    

    const linkVoltar = document.createElement('a');
    linkVoltar.href = 'index.html';
    linkVoltar.className = 'link-voltar';
    linkVoltar.textContent = '← Voltar para a lista';
    infoDiv.append(titulo, autor, idioma, downloads, topicosContainer, linkVoltar);
    container.append(posterDiv, infoDiv);
    return container;
}

/**
 * Renderiza uma mensagem na tela.
 * @param {HTMLElement} container
 * @param {string} mensagem 
 * @param {'loading' | 'error' | 'info'} tipo 
 */
function renderizarMensagem(container, mensagem, tipo = 'info') {
    container.innerHTML = `<p class="${tipo}-message">${mensagem}</p>`;
}


// --- LÓGICA PRINCIPAL DA PÁGINA ---

async function inicializarPaginaDetalhes() {
    const detalhesContainer = document.getElementById('detalhes-livro-container');
    const livroId = new URLSearchParams(window.location.search).get('id');

    if (!livroId) {
        renderizarMensagem(detalhesContainer, 'ID do livro não fornecido na URL.', 'error');
        return;
    }

    renderizarMensagem(detalhesContainer, 'Carregando detalhes do livro...', 'loading');

    try {
        const livro = await getLivroDetalhes(livroId);
        document.title = livro.titulo;

        detalhesContainer.innerHTML = ''; 
        const estruturaDetalhes = criarEstruturaDetalhes(livro);
        detalhesContainer.appendChild(estruturaDetalhes);

    } catch (error) {
        console.error('Erro ao carregar detalhes do livro:', error);
        renderizarMensagem(detalhesContainer, `Não foi possível carregar os detalhes. (${error.message})`, 'error');
    }
}

document.addEventListener('DOMContentLoaded', inicializarPaginaDetalhes);