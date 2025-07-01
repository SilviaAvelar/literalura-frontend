const BASE_URL = 'https://literalura-backend-production.up.railway.app'; 

export async function getTodosLivros(page = 0, size = 8) {
    try {
        const response = await fetch(`${BASE_URL}/livros?page=${page}&size=${size}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Erro ao buscar livros: ${response.status} ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha em getTodosLivros:", error);
        throw error;
    }
}

export async function buscarESalvarLivroPorTitulo(titulo) {
    try {
        const response = await fetch(`${BASE_URL}/livros/buscar-salvar/titulo/${encodeURIComponent(titulo)}`, {
            method: 'POST' 
        });

        if (response.status === 404) {
            return null; 
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao buscar e salvar livro: ${response.status} ${response.statusText}. Detalhes: ${errorText}`);
        }
        
        return await response.json(); 
    } catch (error) {
        console.error("Falha em buscarESalvarLivroPorTitulo:", error);
        throw error;
    }
}

export async function getLivroDetalhes(id) {
    try {
        const response = await fetch(`${BASE_URL}/livros/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes do livro: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Falha ao buscar detalhes do livro com id ${id}:`, error);
        throw error;
    }
}

export async function getLivrosPorIdioma(idioma, page = 0, size = 8) {
    try {
        const response = await fetch(`${BASE_URL}/livros/idioma/${idioma}?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar livros por idioma: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Falha ao buscar livros para o idioma ${idioma}:`, error);
        throw error;
    }
}

export async function getTodosAutores(page = 0, size = 8) {
    try {
        const response = await fetch(`${BASE_URL}/autores?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar autores: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha em getTodosAutores:", error);
        throw error;
    }
}

export async function getAutoresVivosEmAno(ano, page = 0, size = 8) {
    try {
        const response = await fetch(`${BASE_URL}/autores/vivos/${ano}?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar autores vivos: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Falha ao buscar autores vivos para o ano ${ano}:`, error);
        throw error;
    }
}

export async function getAutoresPorNome(nome, page = 0, size = 8) {
    try {
        const response = await fetch(`${BASE_URL}/autores/search?nome=${encodeURIComponent(nome)}&page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar autores por nome: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha em getAutoresPorNome:", error);
        throw error;
    }
}

export async function getTop10Livros() {
    try {
        const response = await fetch(`${BASE_URL}/livros/top10`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar Top 10 livros: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha em getTop10Livros:", error);
        throw error;
    }
}

export async function getEstatisticas() {
    try {
        const response = await fetch(`${BASE_URL}/livros/stats`);
        if (response.status === 204) { 
            return null; 
        }
        if (!response.ok) {
            throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha em getEstatisticas:", error);
        throw error;
    }
}