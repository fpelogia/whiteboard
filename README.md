# Lousa Digital Colaborativa com Suporte a LaTeX
## Vídeo com a Ideia
[![IMAGE ALT TEXT](http://img.youtube.com/vi/1wKecN7MMvU/0.jpg)](http://www.youtube.com/watch?v=1wKecN7MMvU "Video Title")


------------

## Requisitos

### Deve fornecer ferramentas e funcionalidades básicas de ferramentas de paint

#### Deve ter as ferramentas:

- **Caixa para seleção de cor**
    - cores pré-definidas (preto, azul, vermelho, verde, amarelo)
    - seleção manual
- **Ferramenta Pincel**
    - possibilidade de trocar a espessura (valores pré-definidos)
- **Ferramenta Seleção Retangular**
    - possibilidade de movimentar a seleção
- **Ferramenta Borracha (Apagador)**
    - apaga qualquer tipo de tinta
- **Ferramenta Lata de Tinta**
    - preenche quaisquer ciclos fechados
- **Ferramenta Reta**
    - desenha linha reta ao segurar o clique do mouse
- **Ferramenta Caixa de Texto**
    - possibilita redimensionamento
    - seleção do tamanho da fonte
    - seleção do estilo: normal, **negrito**, *itálico*

#### E as funcionalidades:

- **Desfazer ação (Ctrl + z)**
    - botão de desfazer
- **Exportar imagem**
    - formato png
    - (talvez) outros formatos, como jpeg, svg e pdf
- **Colar imagem da área de transferência (Ctr + v)**

### Deve possibilitar interpretação de comandos LaTeX

- **Disponibilização como uma ferramenta adicional**
- **Desejável: interpretação com baixo tempo de resposta**

### Deve possibilitar acesso simultâneo da lousa por múltiplos usuários

- **Deve permitir interação simultânea de diversos usuários com a lousa (socket.io)**
- **Deve possibilitar compartilhamento de sessão por código ou link (together.js)**
