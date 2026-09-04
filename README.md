# Mar(é) — conexão com o oceano

> Antes do mar, informação. Depois do mar, observação. Ao longo do tempo, conhecimento coletivo.

O **Mar(é)** é uma plataforma mobile-first para aproximar alunos, escolas náuticas e o oceano. O MVP permite consultar uma referência de balneabilidade, registrar remadas e outras atividades, relatar lixo encontrado e transformar observações individuais em dados úteis para educação ambiental e gestão do litoral.

## Estado atual

Esta é a versão **0.1.0**, um protótipo funcional sem backend e sem dependências externas. Os dados ficam no `localStorage` do navegador, o que permite demonstrar e validar as jornadas antes da construção da API definitiva.

Funcionalidades já navegáveis:

- acesso demonstrativo como aluno ou administrador;
- painel do aluno com resumo da jornada;
- separação entre dado oficial e observação da comunidade;
- registro de atividade, condições percebidas e lixo encontrado;
- histórico pessoal e exploração de localidades;
- painel administrativo com registros, balneabilidade, avisos e alunos;
- persistência local e funcionamento responsivo;
- manifesto e service worker para instalação como PWA.

> **Atenção:** todos os dados de balneabilidade exibidos no protótipo são fictícios. Eles não devem ser usados para decidir se uma praia está própria para banho.

## Executar localmente

O projeto não exige instalação de pacotes nesta etapa.

```bash
python3 -m http.server 8080
```

Abra no navegador:

```text
http://localhost:8080/app/
```

No Windows também é possível executar:

```powershell
py -m http.server 8080
```

## Estrutura

```text
mare/
├── app/                    # Protótipo PWA sem dependências
│   ├── assets/icon.svg
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── manifest.webmanifest
│   └── service-worker.js
├── api/openapi.yaml        # Contrato inicial da futura API
├── database/schema.sql     # Modelo relacional inicial em PostgreSQL
├── docs/PRODUTO.md         # Escopo, regras e roadmap
└── README.md
```

## Direção técnica

Depois da validação do protótipo, a implementação de produção está planejada com:

- **frontend:** React + TypeScript, mobile-first e PWA;
- **backend:** Laravel API;
- **autenticação:** Laravel Sanctum;
- **banco:** PostgreSQL;
- **fotos:** armazenamento compatível com S3;
- **implantação piloto:** ATHÉNÁ, em Fortaleza;
- **evolução:** arquitetura multi-escola e integração com fontes oficiais.

## Princípio de confiança

O Mar(é) nunca deve transformar uma percepção comunitária em classificação oficial. A interface e o modelo de dados mantêm separadas:

1. **balneabilidade oficial**, com fonte, ponto, data de coleta e publicação;
2. **observações participativas**, como lixo, odor, cor da água, vento e percepção de segurança.

## Próximos marcos

1. Validar o fluxo com alunos e administradores da escola piloto.
2. Ajustar campos, linguagem e acessibilidade.
3. Criar monorepo de produção com React e Laravel.
4. Implementar autenticação, API e banco PostgreSQL.
5. Integrar uma fonte oficial de balneabilidade.
6. Testar o piloto em campo e medir adesão aos registros.

## Licença e uso

Projeto em desenvolvimento. Antes de uso comercial ou abertura pública, definir licença, política de privacidade, termos de uso e responsabilidades sobre dados ambientais.
