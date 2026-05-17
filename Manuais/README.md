# Sistema de Cotação de Tatuagens Temporárias

Sistema completo para cotação de serviços de tatuagens temporárias para eventos, com cálculo automático de preços baseado em múltiplos fatores.

## Funcionalidades

### 1. Formulário de Solicitação de Cotação
- **Seleção de Data**: Permite que o cliente escolha a data do evento
- **Seleção de Cidade**: Lista completa de todas as cidades do estado de São Paulo
- **Tempo de Ação**: Opção entre quantidade de convidados ou tempo direto em horas
- **Validação**: Campos obrigatórios com validação em tempo real

### 2. Cálculo Inteligente de Cotação
- **Cálculo de Tempo de Ação**: 
  - Para menos de 150 convidados: tempo fixo de 2 horas
  - Para mais de 150 convidados: cálculo automático baseado no excesso
- **Precificação Dinâmica**: 
  - Base de dados de preços para cidades específicas
  - Cálculo automático de distância geográfica
  - Sobretaxa de R$9,00 por km para cidades não catalogadas
- **Limite de Atendimento**: Rejeição automática para cidades a mais de 130km

### 3. Apresentação de Resultados
- **Detalhes Completos**: Mostra todas as informações da cotação
- **Opções de Preço**: Preto e branco vs colorido
- **Valores por Extenso**: Formatação completa em português
- **Código Único**: Hash identificador para cada cotação

### 4. Funcionalidades Adicionais
- **Download PDF**: Gera documento formatado para download
- **Integração WhatsApp**: Botão que abre o WhatsApp com mensagem pré-formatada
- **Histórico Local**: Salva todas as cotações no localStorage do navegador
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## Estrutura do Projeto

```
CotacaoTatua/
├── index.html          # Página principal do aplicativo
├── styles.css          # Estilos CSS com tema escuro moderno
├── app.js             # Lógica principal do aplicativo
├── cities.js          # Dados de cidades e preços
├── pricing.csv        # Arquivo CSV com preços por cidade
├── tatua.png          # Logo da empresa
└── README.md          # Documentação do projeto
```

## Como Usar

### Desenvolvimento Local
1. Abra o arquivo `index.html` diretamente no navegador
2. O sistema funciona completamente offline
3. Não requer servidor backend

### Publicação na Internet
Como este é um projeto frontend estático, pode ser publicado em qualquer serviço de hospedagem estática:

#### Opções Gratuitas:
- **GitHub Pages**: Crie um repositório e habilite o Pages
- **Netlify**: Arraste e solte a pasta do projeto
- **Vercel**: Importe do GitHub ou arraste a pasta
- **Surge.sh**: `surge` na linha de comando

#### Exemplo com Netlify:
```bash
cd C:\Users\Administrador\Desktop\CotacaoTatua
npx netlify-cli deploy --prod --dir .
```

#### Exemplo com GitHub Pages:
1. Crie um repositório no GitHub
2. Faça upload dos arquivos do projeto
3. Vá em Settings > Pages
4. Escolha a branch `main` e salve

## Cálculos e Lógica

### Fórmula de Cálculo de Tempo de Ação

Para número de convidados:
```
Se convidados < 150:
    tempo_de_ação = 2 horas
Se convidados ≥ 150:
    excesso = convidados - 150
    tempo_adicional = arredondar_para_cima(excesso / 60)
    tempo_de_ação = 2 + tempo_adicional
```

### Cálculo de Preço

Para cidades catalogadas:
```
preço_final = preço_base_da_cidade
```

Para cidades não catalogadas (menos de 130km):
```
preço_base_são_paulo = preço_base_SP
distância_km = calcular_distância(cidade, zona_sul_SP)
sobretaxa = arredondar(distância_km) × 9
preço_final = preço_base_são_paulo + sobretaxa
```

### Cálculo de Distância
O sistema utiliza a fórmula de Haversine para cálculo preciso de distância geográfica entre duas coordenadas, considerando a curvatura da Terra.

## Configuração de Preços

### Editando Preços por Cidade
Os preços são definidos no arquivo `cities.js` na constante `pricingData` e no arquivo `pricing.csv`. Para adicionar uma nova cidade:

```javascript
const pricingData = [
    // ... dados existentes
    "NovaCidade,PB,2,2000.00",
    "NovaCidade,Colorido,2,2300.00",
    // ...
];
```

### Adicionando Coordenadas de Cidades
Para cidades não catalogadas, adicione as coordenadas em `cityCoordinates`:
```javascript
const cityCoordinates = {
    // ... coordenadas existentes
    "NovaCidade": {
        lat: -23.1234,
        lon: -46.5678
    }
};
```

## Customização

### Mudando o Limite de Distância
No arquivo `app.js`, modifique a constante:
```javascript
if (distance > 130) { // Mude 130 para o valor desejado
    // ...
}
```

### Alterando a Sobretaxa por Km
No arquivo `app.js`, modifique:
```javascript
const distanceSurcharge = Math.ceil(distance) * 9; // Mude 9 para o valor desejado
```

### Personalizando o Design
Edite o arquivo `styles.css` para alterar:
- Cores do tema
- Layout e espaçamentos
- Responsividade
- Animações

## Contato e Suporte

### WhatsApp de Contato
Para mudar o número de WhatsApp, edite no arquivo `app.js`:
```javascript
const whatsappURL = `https://wa.me/5513997848897?text=${message}`;
```

### Logo
Substitua o arquivo `tatua.png` mantendo o mesmo nome de arquivo.

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com gradientes e animações
- **JavaScript (Vanilla)**: Lógica do aplicativo
- **LocalStorage**: Persistência de dados no navegador
- **Haversine Formula**: Cálculo de distância geográfica

## Compatibilidade

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Segurança e Privacidade

- Todos os dados são processados localmente no navegador
- Nenhuma informação é enviada para servidores externos
- Histórico de cotações salvo no localStorage (privado ao dispositivo)
- Não requer cookies nem rastreamento

## Manutenção e Futuras Melhorias

### Possíveis Melhorias:
1. Backend para salvar cotações em banco de dados
2. Integração com API de geocodificação para coordenadas precisas
3. Sistema de autenticação para clientes
4. Dashboard administrativo para visualizar cotações
5. Geração de PDF profissional com biblioteca especializada
6. Multi-idioma (inglês/espanhol)
7. Sistema de agendamento online
8. Pagamento online integrado

### Manutenção Atual:
- Adicionar novas cidades e preços conforme necessário
- Atualizar base de coordenadas para melhor precisão
- Revisar e ajustar fórmulas de cálculo
- Testar compatibilidade com novos navegadores

## Licença

Este projeto foi desenvolvido exclusivamente para Tatuá - Tatuagens Temporárias.

## Créditos

Desenvolvido por Claude Code em 2026.

---

**Nota**: Este é um sistema frontend estático. Para uso em produção com grandes volumes de tráfego, considere adicionar um servidor backend para melhor performance e segurança.