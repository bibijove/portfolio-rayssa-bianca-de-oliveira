# 🌸 Flower Classifier: Teachable Machine Web App

![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Teachable Machine](https://img.shields.io/badge/Teachable_Machine-4285F4?style=for-the-badge&logo=google&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![TensorFlow MobileNet](https://img.shields.io/badge/MobileNet-v2-blue?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Yes-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Educational-lightgrey?style=for-the-badge)

---

## 📝 Descrição do Projeto

O **Flower Classifier** é uma aplicação web interativa de **Visão Computacional** e **Aprendizado de Máquina** desenvolvida com o **Google Teachable Machine** e executada no navegador por meio do **TensorFlow.js**.

A plataforma permite que o usuário envie imagens diretamente do computador ou do Google Drive e obtenha, em tempo real, a probabilidade de pertencimento a cada uma das classes treinadas. O sistema foi projetado para demonstrar, de forma prática e intuitiva, como modelos de Deep Learning podem ser incorporados em aplicações web sem necessidade de backend.

O modelo exportado utiliza uma arquitetura baseada em **MobileNetV2**, altamente otimizada para classificação de imagens com baixo custo computacional e excelente desempenho em dispositivos móveis e desktops.

---

## 🎯 Objetivos do Projeto

- Demonstrar a aplicação prática de redes neurais convolucionais (CNNs).
- Integrar modelos treinados no Teachable Machine em aplicações web.
- Realizar inferência local diretamente no navegador.
- Exibir resultados de forma visual e intuitiva.
- Servir como base para projetos educacionais e protótipos de IA.

---

## 🖼️ Interface da Aplicação

![Interface do Classificador](https://github.com/bibijove/portfolio-rayssa-bianca-de-oliveira/blob/main/projeto-laboratorio-de-classificacao-visual/img/IMG.jpg)
*Figura 1: Interface principal da aplicação com upload de imagens e exibição das probabilidades de classificação.*

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- HTML5
- CSS3
- JavaScript (ES6+)

### 🤖 Machine Learning
- Google Teachable Machine
- TensorFlow.js
- MobileNetV2 (Transfer Learning)

### ☁️ Integrações
- Upload local de arquivos
- Importação via Google Drive

### 📊 Visualização
- Barras percentuais dinâmicas
- Interface responsiva e amigável

---

## 🧠 Arquitetura do Modelo

O classificador foi treinado com imagens de tamanho **224 × 224 pixels** e possui **duas classes de saída**. O modelo é armazenado em três arquivos principais:

- `model.json` → Estrutura da rede neural.
- `weights.bin` → Pesos treinados.
- `metadata.json` → Informações complementares do modelo.

### 📌 Especificações Técnicas

| Parâmetro | Valor |
|--------:|:------|
| TensorFlow.js | 1.7.4 |
| Teachable Machine | 2.4.14 |
| Input Size | 224 × 224 px |
| Classes | 2 |
| Labels Padrão | Class 1, Class 2 |
| Exportação | TensorFlow.js |
| Inferência | Client-side |
| Backbone | MobileNetV2 |

---

## 📂 Estrutura Completa do Projeto

```text
projeto-laboratorio-de-classificacao/
├── img/
│   └── IMG.jpg               # Captura de tela da aplicação
├── README.md                 # Documentação do projeto
├── metadata.json             # Metadados do modelo
├── model.json                # Arquitetura da rede neural
└── weights.bin               # Pesos treinados do modelo
```

---

## ⚙️ Funcionamento do Sistema

### 1️⃣ Upload da Imagem
O usuário seleciona uma imagem local ou do Google Drive.

### 2️⃣ Pré-processamento
A imagem é redimensionada automaticamente para 224 × 224 pixels.

### 3️⃣ Carregamento do Modelo
O TensorFlow.js carrega `model.json` e `weights.bin`.

### 4️⃣ Inferência
O modelo executa a classificação e calcula as probabilidades.

### 5️⃣ Visualização
Os resultados são apresentados em barras percentuais.

---

## 📈 Exemplo de Predição

Ao processar uma imagem de um buquê de flores, o sistema retornou:

| Classe | Probabilidade |
|------|---------------:|
| Perfil Liderança | 74% |
| Perfil Operacional | 26% |

---

## 📊 Funcionalidades

### 🔍 Classificação de Imagens
- Upload de imagens em `.jpg`, `.jpeg` e `.png`
- Inferência em tempo real
- Probabilidades detalhadas

### 📈 Visualização Dinâmica
- Barras coloridas
- Percentuais automáticos
- Interface intuitiva

### 📱 Design Responsivo
- Compatível com smartphones
- Compatível com tablets
- Compatível com desktops

### 🔒 Privacidade
- Processamento local
- Nenhum dado enviado para servidores externos

### ⚡ Alto Desempenho
- Execução com TensorFlow.js
- Modelo otimizado com MobileNetV2

---

## 🔧 Como Executar Localmente

### Pré-requisitos

- Navegador moderno (Chrome, Edge, Firefox, Opera)
- VS Code com Live Server (recomendado)

### Instalação

```bash
git clone https://github.com/seu-usuario/flower-classifier.git
cd flower-classifier
```

### Execução

Abra o projeto com o Live Server ou outro servidor local.

Exemplo com Python:

```bash
python -m http.server 8000
```

Acesse:

```text
http://localhost:8000
```

---

## 🧪 Como Treinar um Novo Modelo

1. Acesse o Teachable Machine.
2. Crie um projeto de Image Classification.
3. Adicione suas classes e imagens.
4. Treine o modelo.
5. Exporte no formato TensorFlow.js.
6. Substitua:
   - `model.json`
   - `metadata.json`
   - `weights.bin`

---

## 📉 Métricas e Desempenho

O desempenho do modelo depende diretamente de:

- Quantidade de imagens de treinamento.
- Qualidade das imagens.
- Balanceamento entre classes.
- Número de épocas de treinamento.
- Diversidade dos exemplos.

### Recomendações

- Utilizar ao menos 50 imagens por classe.
- Garantir iluminação variada.
- Incluir diferentes ângulos e fundos.

---

## 🧬 Pipeline de Inferência

```text
Imagem → Resize (224x224) → Tensor → MobileNetV2 → Dense Layers → Softmax → Probabilidades
```

---

## 🖥️ Exemplo de Código de Predição

```javascript
const prediction = await model.predict(imageElement);
prediction.forEach(result => {
  console.log(result.className, result.probability);
});
```

---

## 📌 Casos de Uso

- Classificação de flores
- Identificação de plantas
- Reconhecimento de objetos
- Sistemas educacionais
- Protótipos de IA
- Demonstrações acadêmicas

---

## 🎓 Conceitos Aplicados

- Deep Learning
- Redes Neurais Convolucionais (CNN)
- Transfer Learning
- Computer Vision
- TensorFlow.js
- Machine Learning no navegador

---

## 🛡️ Vantagens da Solução

- Sem necessidade de backend
- Baixo custo operacional
- Fácil manutenção
- Alta portabilidade
- Privacidade garantida
- Escalável para novos modelos

---

## 🔮 Melhorias Futuras

- Suporte para mais classes
- Captura por webcam
- Histórico de classificações
- Exportação em PDF
- Gráficos de desempenho
- Tema escuro
- Internacionalização (i18n)

---

## 📚 Referências

- TensorFlow.js
- Google Teachable Machine
- MobileNetV2
- Deep Learning

---

## 👨‍💻 Autor

Desenvolvido como projeto prático de **Inteligência Artificial**, **Visão Computacional** e **Desenvolvimento Web**, demonstrando a integração entre modelos de aprendizado de máquina e aplicações front-end modernas.

---

## 📄 Licença

Este projeto é disponibilizado para fins educacionais, acadêmicos e de pesquisa.

---

## ⭐ Apoie o Projeto

Se este projeto foi útil para você:

- ⭐ Deixe uma estrela no repositório.
- 🍴 Faça um fork.
- 🛠️ Contribua com melhorias.
- 📢 Compartilhe com outros estudantes e desenvolvedores.

---

[⬆ Voltar ao início](https://github.com/bibijove/portfolio-rayssa-bianca-de-oliveira)
