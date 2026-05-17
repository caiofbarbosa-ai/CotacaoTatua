# Guia de Deploy - Sistema de Cotação Tatuá

## 🚀 Opções de Deploy

Como este é um projeto estático (apenas HTML, CSS, JavaScript), você tem várias opções gratuitas e simples para publicar na internet.

---

## 1️⃣ Netlify (Mais Fácil)

### Passo a Passo:
1. **Crie uma conta** em [netlify.com](https://www.netlify.com)
2. **Fazer upload manual:**
   - Faça login no Netlify
   - Clique em "Add new site" → "Deploy manually"
   - Arraste a pasta `C:\Users\Administrador\Desktop\CotacaoTatua` e solte
   - Pronto! O site estará online instantaneamente

3. **Comando (requer Node.js):**
   ```bash
   cd C:\Users\Administrador\Desktop\CotacaoTatua
   npx netlify-cli deploy --prod --dir .
   ```

### Vantagens:
- Super rápido
- SSL gratuito (HTTPS)
- Domínio gratuito (seu-site.netlify.app)
- Deploy instantâneo
- Suporte a formulários gratuitos

---

## 2️⃣ GitHub Pages (Gratuito e Robusto)

### Passo a Passo:
1. **Crie um repositório no GitHub:**
   - Vá para [github.com](https://github.com) e faça login
   - Clique no "+" → "New repository"
   - Nome: `cotacao-tatua`
   - Clique em "Create repository"

2. **Fazer upload dos arquivos:**
   - No repositório criado, clique em "uploading an existing file"
   - Arraste todos os arquivos da pasta CotacaoTatua
   - Clique em "Commit changes"

3. **Ativar GitHub Pages:**
   - Vá para "Settings" → "Pages"
   - Em "Build and deployment" → "Source", escolha "Deploy from a branch"
   - Selecione "main" (ou "master") e "/ (root)"
   - Clique em "Save"

4. **Aguarde alguns minutos:**
   - O site estará disponível em: `https://seu-usuario.github.io/cotacao-tatua/`

### Vantagens:
- 100% gratuito
- Suporte a domínios customizados
- Integração com Git
- CDN do GitHub

---

## 3️⃣ Vercel (Alternativa Moderna)

### Passo a Passo:
1. **Crie uma conta** em [vercel.com](https://vercel.com)
2. **Deploy manual:**
   - Faça login no Vercel
   - Clique em "Add New..." → "Project"
   - Arraste a pasta do projeto
   - Clique em "Deploy"

3. **Ou com linha de comando:**
   ```bash
   cd C:\Users\Administrador\Desktop\CotacaoTatua
   npm install -g vercel
   vercel --prod
   ```

### Vantagens:
- Interface moderna
- Deploy automático
- Analytics gratuito
- Suporte excelente

---

## 4️⃣ Surge.sh (Super Simples via Linha de Comando)

### Passo a Passo:
1. **Instale o Surge:**
   ```bash
   npm install -g surge
   ```

2. **Fazer deploy:**
   ```bash
   cd C:\Users\Administrador\Desktop\CotacaoTatua
   surge
   ```

3. **Durante o processo, você será solicitado a:**
   - Fazer login (criar conta gratuita)
   - Escolher um domínio (ex: cotacao-tatua.surge.sh)

### Vantagens:
- Não requer conta no começo
- Deploy em segundos
- SSL gratuito
- Domínios .surge.sh gratuitos

---

## 5️⃣ AWS S3 (Para Usuários Avançados)

### Passo a Passo:
1. **Configure um bucket S3:**
   - Acesse o console AWS
   - Crie um bucket (ex: `cotacao-tatua`)
   - Faça upload dos arquivos

2. **Configure para hosting estático:**
   - Properties → Static website hosting → Enable
   - Index document: `index.html`

3. **Configure permissões:**
   - Permissions → Bucket Policy
   - Adicione policy de leitura pública

### Vantagens:
- Alta escalabilidade
- CDN CloudFront integrado
- Muito confiável
- Baixo custo

---

## 🎯 Recomendação

**Para iniciantes:** Netlify ou GitHub Pages
**Para usuários técnicos:** Vercel ou Surge.sh
**Para empresas:** AWS S3 + CloudFront

---

## 🌐 Configuração de Domínio Próprio

### Passo a passo (Netlify):
1. No Netlify, vá para "Domain settings"
2. Clique em "Add custom domain"
3. Digite seu domínio (ex: `cotacaotatua.com.br`)
4. Siga as instruções de DNS fornecidas

### Passo a passo (GitHub Pages):
1. No repositório, crie um arquivo `CNAME`
2. Adicione seu domínio no arquivo
3. Configure os registros DNS no seu provedor de domínio

---

## 📱 Testando o Deploy

Após fazer o deploy:
1. **Teste em diferentes navegadores:** Chrome, Firefox, Safari
2. **Teste em mobile:** Abra no celular
3. **Verifique funcionalidades:**
   - Formulário de cotação
   - Cálculo de preços
   - Download de PDF
   - Integração WhatsApp
   - Histórico de cotações

---

## 🔒 HTTPS e Segurança

Todos os serviços mencionados fornecem **SSL gratuito (HTTPS)**:
- Netlify: Automático
- GitHub Pages: Automático
- Vercel: Automático
- Surge.sh: Automático
- AWS S3: Requer configuração manual

---

## 📊 Monitoramento e Analytics

### Netlify Analytics:
- Ative nas configurações do site
- Dados de visitação em tempo real
- Mapas de origem de tráfego

### GitHub Pages:
- Use GitHub Insights (limitado)
- Integre com Google Analytics

### Vercel Analytics:
- Analytics gratuito incluído
- Performance monitoring

---

## 🔄 Atualizações Futuras

### Como fazer updates:
1. **Netlify/Vercel:** Basta fazer upload novamente ou usar Git
2. **GitHub Pages:** Faça push no repositório
3. **Surge.sh:** Execute o comando `surge` novamente

### Automação:
Configure deploy automático ao fazer push no Git:
- Netlify: Conecte ao GitHub
- Vercel: Conecte ao GitHub
- GitHub Pages: Atualiza automaticamente

---

## ❓ Suporte e Problemas Comuns

### Problemas frequentes:
1. **Erro 404:** Verifique se o arquivo index.html está na pasta raiz
2. **CSS não carregando:** Verifique o caminho do arquivo no HTML
3. **JavaScript não funcionando:** Abra o console do navegador (F12) para verificar erros
4. **Imagens não aparecendo:** Verifique os nomes dos arquivos (maiúsculas/minúsculas)

### Onde conseguir ajuda:
- Documentação oficial da plataforma escolhida
- Stack Overflow
- Suporte da plataforma

---

## 💰 Custos

| Serviço | Plano Gratuito | Plano Pago |
|---------|---------------|-----------|
| Netlify | ✓ (ilimitado) | $19/mês |
| GitHub Pages | ✓ (ilimitado) | ✓ (ilimitado) |
| Vercel | ✓ (ilimitado) | $20/mês |
| Surge.sh | ✓ (ilimitado) | $30/mês |
| AWS S3 | ✓ (12 meses) | Pay-as-you-go |

**Nota:** Para este projeto, o plano gratuito é suficiente!

---

## 🎉 Conclusão

Seu sistema de cotação está pronto para ser publicado! Escolha a plataforma que melhor se adapta às suas necessidades técnicas e siga o passo a passo.

**Boa sorte com seu negócio de tatuagens temporárias!** 🎨✨