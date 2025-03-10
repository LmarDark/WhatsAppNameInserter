let nomeAtendente = null;
let textareaEl = null;
let mainEl = null;

// Função para enviar a mensagem
function sendMessage(message) {
  if (!nomeAtendente) {
    nomeAtendente = prompt('Qual o nome do atendente?');
  }

  if (!textareaEl || !mainEl) {
    throw new Error('Não há conversa aberta');
  }

  const messageWithName = `~_*${nomeAtendente}*_:`;
  const messageWithLineBreak = messageWithName + '\n';
  textareaEl.focus();
  
  // Limpa o conteúdo atual e insere a nova mensagem
  document.execCommand('selectAll');
  document.execCommand('delete');
  document.execCommand('insertHTML', false, messageWithLineBreak);

  // Garante que o evento 'change' seja disparado
  textareaEl.dispatchEvent(new Event('change', { bubbles: true }));

  // Espera um momento para garantir que o conteúdo foi atualizado
  setTimeout(() => {
    // Clica no botão de enviar
    const sendButton = mainEl.querySelector('[data-testid="send"]') || mainEl.querySelector('[data-icon="send"]');
    if (sendButton) {
      sendButton.click();
    } else {
      throw new Error('Botão de enviar não encontrado');
    }
  }, 100);
}

// Função para verificar se o DOM foi atualizado e redefinir os elementos
function updateElements() {
  mainEl = document.querySelector('#main');
  textareaEl = mainEl ? mainEl.querySelector('div[contenteditable="true"]') : null;

  if (!textareaEl || !mainEl) {
    throw new Error('Não foi possível encontrar os elementos do chat');
  }
}

// Configura o MutationObserver para observar mudanças no DOM
const observer = new MutationObserver(() => {
  updateElements();
});

// Inicia a observação do DOM para detectar mudanças (ex.: troca de chat)
observer.observe(document.body, {
  childList: true, // Observa a adição e remoção de nós
  subtree: true // Observa todos os descendentes
});

// Adiciona um ouvinte de evento para capturar o pressionamento de Enter
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    // Impede a ação padrão de enviar a mensagem ou adicionar uma nova linha
    event.preventDefault();

    // Obtém o texto que foi escrito na textarea (contenteditable)
    const message = textareaEl.textContent.trim(); // O método trim() remove espaços extras no começo e fim
    console.log(message);
    
    if (!message) {
      throw new Error('Não há mensagem para enviar');
    }

    // Chama a função sendMessage apenas se houver mensagem
    sendMessage(message);
    
    // Limpa o campo de texto após enviar a mensagem
    textareaEl.textContent = '';
  }
});

// Inicializa os elementos ao carregar o script
updateElements();
