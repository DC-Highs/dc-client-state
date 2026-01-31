# @dchighs/dc-client-state

> ⚠️ **Aviso**: Esta biblioteca **NÃO** é destinada a hacking ou trapaças. O autor é radicalmente contra hacking. Esta biblioteca altera apenas estados de preferência locais e ativos; ela **não** fornece nenhuma vantagem no jogo nem modifica dados do servidor.

**@dchighs/dc-client-state** é uma biblioteca para acessar e gerenciar o estado local do cliente do Dragon City (versão Windows). Ela permite ler e modificar o `UserDefault.xml` (preferências) e acessar ativos em cache local.

[Read English Documentation here](./README.md)

## 📦 Instalação

A instalação é simples—basta usar seu gerenciador de pacotes preferido. Aqui está um exemplo usando NPM:

```cmd
npm i @dchighs/dc-client-state
```

## 🚀 Uso

Para começar a interagir com o estado do cliente Dragon City, você pode instanciar a classe `ClientState`. Ela tenta localizar automaticamente o diretório de instalação do Dragon City em sua máquina Windows.

### Inicializando o Client State

```ts
import { ClientState } from "@dchighs/dc-client-state"

const client = new ClientState()
console.log(`Diretório do jogo encontrado em: ${client.dragonCityDirPath}`)
```

## 🏗 Acesso de Alto Nível vs Baixo Nível

Esta biblioteca fornece duas maneiras de interagir com os dados armazenados pelo jogo: **UserDefault** (Baixo Nível) e **Preferences** (Alto Nível).

### 1. UserDefault (Baixo Nível)
`UserDefault` fornece acesso direto ao arquivo `UserDefault.xml`. Ele opera em pares chave-valor brutos, exatamente como são armazenados pelo jogo. Você deve usar isso se souber as chaves internas específicas que deseja ler ou modificar.

*   **Prós**: Controle total sobre cada entrada no arquivo XML.
*   **Contras**: Requer conhecimento dos nomes das chaves internas (ex: "options_music_disabled").

**Exemplo:**
```ts
// Obter um valor bruto pela chave
const musicDisabled = await client.userDefault.get("options_music_disabled")

// Definir um valor bruto manualmente
await client.userDefault.set("options_music_disabled", true)
```

### 2. Preferences (Alto Nível)
`Preferences` é um wrapper (encapsulamento) em torno do `UserDefault` que fornece métodos semânticos e tipados para tarefas comuns. Ele abstrai os nomes obscuros das chaves em chamadas de função legíveis.

*   **Prós**: Mais fácil de usar, código legível, validação de tipos.
*   **Contras**: Limitado aos recursos específicos implementados na classe.

**Exemplo:**
```ts
// Desativar música usando um método nomeado
await client.preferences.disableMusic()

// Obter o ID do Usuário
const userId = await client.preferences.getUserId()


// Definir todas as fazendas para cultivar uma comida específica
await client.preferences.setAllFarmCrops(1)
```

## 🎨 Gerenciamento de Ativos

A classe `Assets` permite gerenciar os arquivos armazenados em cache local pelo jogo. Isso pode ser útil para substituir texturas, músicas ou outros ativos por personalizados (localmente). Ela é acessível via `client.assets`.

### Listando Ativos

Você pode listar todos os ativos atualmente no cache, filtrando opcionalmente por tipo.

```ts
import { AssetType } from "@dchighs/dc-client-state"

// Listar todos os ativos
const allAssets = await client.assets.listAssets()
console.log(`Encontrados ${allAssets.length} ativos`)

// Listar apenas ativos de imagem (png, jpg)
const images = await client.assets.listAssets([AssetType.Image])
console.log("Imagens encontradas:", images)
```

### Substituindo um Ativo

Para substituir um ativo, você precisa do nome do arquivo atual no cache e o caminho para o seu arquivo de substituição.

```ts
const assetName = "ui_button_close.png" // Exemplo de nome de ativo
const myReplacementFile = "./meus-ativos-customizados/novo-botao-fechar.png"

await client.assets.set(assetName, myReplacementFile)
```

### Obtendo o Caminho de um Ativo

Se você precisar do caminho absoluto completo de um ativo em cache:

```ts
const fullPath = client.assets.getFilePath("algum_som.mp3")
```

### Limpeza

Você pode excluir um ativo específico ou limpar todo o cache.

```ts
// Excluir um ativo específico
await client.assets.delete("banner_antigo.png")

// ⚠️ AVISO: Isso exclui TODOS os arquivos na pasta de cache local!
// O jogo baixará os ativos necessários novamente na próxima inicialização.
await client.assets.clearAssets()
```

## 🤝 Contribuindo

* Quer contribuir? Siga estes passos:
* Faça um fork do repositório.
* Crie uma nova branch (`git checkout -b feature-new`).
* Faça o commit de suas alterações (`git commit -m 'Add new feature'`).
* Envie para a branch (`git push origin feature-new`).
* Abra um Pull Request.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT.
