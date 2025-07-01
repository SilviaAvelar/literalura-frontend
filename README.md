📖 Literalura - Frontend
Este é o frontend da aplicação Literalura, um catálogo interativo de livros desenvolvido para o Challenge de Back-End da Alura. 
Esta interface consome a API RESTful do Literalura Backend para fornecer uma experiência de usuário rica e dinâmica.
A aplicação está no ar! Acesse aqui
![alt text](https://literalura-frontend-git-main-silvia-avelars-projects.vercel.app/assets/images/screenshot.png)

🚀 Funcionalidades Principais
Busca de Livros: Pesquise por livros na API do Project Gutenberg e salve-os no catálogo.
Listagem Completa: Visualize todos os livros e autores já registrados no banco de dados com paginação.
Filtragem Dinâmica: Filtre livros por idioma e busque autores por nome ou por ano em que estavam vivos.
Detalhes do Livro: Veja informações detalhadas de cada livro, incluindo capa, número de downloads e tópicos.
Top 10: Descubra os 10 livros mais populares (com base no número de downloads).
Estatísticas do Catálogo: Visualize dados agregados sobre a coleção de livros.

🛠️ Tecnologias Utilizadas
Este projeto foi construído com uma abordagem moderna e modular, utilizando tecnologias web essenciais:
HTML5: Para a estrutura semântica das páginas.
CSS3: Para a estilização, com uso de Variáveis CSS para um tema consistente e responsivo.
JavaScript (ES6+): Para toda a interatividade, manipulação do DOM e lógica de comunicação com a API.
Fetch API: Para realizar as requisições assíncronas ao backend.
Design Responsivo: A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.

🏛️ Arquitetura e Estrutura
O frontend foi projetado para ser desacoplado do backend, seguindo as melhores práticas de desenvolvimento de APIs:
index.html: A página principal que exibe as listas de livros, autores e os formulários de busca.
detalhes_livro.html: Uma página dedicada a mostrar os detalhes de um livro específico.
css/: Pasta contendo os arquivos de estilo.
styles.css: Estilos globais, cards e layout principal.
detalhes.css: Estilos específicos para a página de detalhes.
js/: Pasta contendo os arquivos JavaScript modulares.
apiService.js: Centraliza todas as chamadas fetch para a API do backend, tornando o código mais limpo e fácil de manter.
home.js: Controla toda a lógica da página index.html.
detalhesLivro.js: Controla a lógica da página detalhes_livro.html.

🌐 Deploy
O frontend está hospedado na Vercel, uma plataforma otimizada para performance e com integração contínua (CI/CD) diretamente do GitHub.
URL da Aplicação: https://literalura-frontend-git-main-silvia-avelars-projects.vercel.app/
Backend Consumido: A API REST hospedada no Railway.

✍️ Autora
Sílvia Avelar
GitHub: @SilviaAvelar
LinkedIn: linkedin.com/in/silvia-avelar
Portfólio: silviaavelar.github.io/Portfolio/