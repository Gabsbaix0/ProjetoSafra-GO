// js/produto-editar.js

// Importa autenticação (auth), banco de dados (db) e armazenamento (storage) do Firebase
import { auth, db, storage } from "../js/firebaseConfig.js";

// Importa funções de autenticação necessárias
import {
  onAuthStateChanged   // Detecta se o usuário está logado ou não
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Importa funções do Firestore para manipular documentos
import {
  doc, getDoc, updateDoc  // doc: cria referência / getDoc: lê / updateDoc: atualiza
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Importa funções do Firebase Storage (para lidar com imagens)
import {
  ref as storageRef,      // Cria referência no Storage
  uploadBytes,            // Faz upload de arquivos
  getDownloadURL,         // Obtém a URL pública da imagem
  deleteObject            // Exclui uma imagem antiga
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Obtém o ID do produto a partir da URL (?id=...)
const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

// Seleciona elementos do HTML
const form = document.getElementById("formEditarProduto"); // Formulário de edição
const msgStatus = document.getElementById("msgStatus");     // Campo para mostrar mensagens
const previewImagem = document.getElementById("previewImagem"); // Área de preview da imagem

// Variáveis globais que armazenam dados do produto e do usuário logado
let produtoData = null;
let usuarioLogado = null;

// Monitora o estado de autenticação (se o usuário está logado)
onAuthStateChanged(auth, async (user) => {
  usuarioLogado = user;
  if (!user) {
    // Se o usuário não estiver logado, bloqueia o acesso e redireciona
    alert("Você precisa estar logado para editar um produto.");
    window.location.href = "login.html";
    return;
  }
  // Se houver ID de produto na URL, carrega os dados do produto
  if (produtoId) await carregarProduto();
});

// Função que busca os dados do produto no Firestore
async function carregarProduto() {
  try {
    // Cria referência ao documento do produto
    const produtoRef = doc(db, "produtos", produtoId);
    // Busca os dados no Firestore
    const produtoSnap = await getDoc(produtoRef);

    // Se o produto não existir
    if (!produtoSnap.exists()) {
      alert("Produto não encontrado.");
      return;
    }

    // Armazena os dados localmente
    produtoData = produtoSnap.data();

    // Verifica se o produto pertence ao vendedor logado
    if (produtoData.vendedorId !== usuarioLogado.uid) {
      alert("Você não tem permissão para editar este produto.");
      // Redireciona para a página do vendedor original
      window.location.href = `vendedor.html?id=${produtoData.vendedorId}`;
      return;
    }

    // Preenche os campos do formulário com os dados existentes
    document.getElementById("nome").value = produtoData.nome || "";
    document.getElementById("descricao").value = produtoData.descricao || "";
    document.getElementById("preco").value = produtoData.preco || "";
    document.getElementById("categoria").value = produtoData.categoria || "";
    document.getElementById("quantidade").value = produtoData.quantidade || 1;

    // Mostra a imagem atual (se houver)
    if (produtoData.imagemUrl) {
      previewImagem.innerHTML = `<img src="${produtoData.imagemUrl}" alt="Preview" style="width:180px;border-radius:8px;">`;
    }
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    alert("Erro ao carregar produto.");
  }
}

// Evento de envio do formulário (salvar alterações)
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o recarregamento da página padrão
  msgStatus.textContent = "Salvando alterações..."; // Mostra status inicial

  try {
    // Captura os valores dos campos do formulário
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const categoria = document.getElementById("categoria").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const imagemFile = document.getElementById("imagem").files[0]; // Arquivo de imagem novo (se houver)

    // Cria referência ao produto no Firestore
    const produtoRef = doc(db, "produtos", produtoId);

    // Objeto com campos a atualizar
    const updates = {
      nome, descricao, preco, categoria, quantidade
    };

    // Se o usuário enviou uma nova imagem
    if (imagemFile) {
      // (Opcional) Apaga imagem antiga do Storage, se houver
      if (produtoData && produtoData.imagemPath) {
        try {
          const oldRef = storageRef(storage, produtoData.imagemPath);
          await deleteObject(oldRef);
        } catch (err) {
          console.warn("Não foi possível apagar imagem antiga:", err.message);
        }
      }

      // Define novo caminho da imagem no Storage
      const caminho = `produtos/${usuarioLogado.uid}/${Date.now()}_${imagemFile.name}`;
      const stRef = storageRef(storage, caminho);

      // Faz upload do novo arquivo
      await uploadBytes(stRef, imagemFile);

      // Obtém a URL pública da nova imagem
      const imagemUrl = await getDownloadURL(stRef);

      // Atualiza os campos da imagem no produto
      updates.imagemUrl = imagemUrl;
      updates.imagemPath = caminho;
    }

    // Atualiza o documento do produto no Firestore
    await updateDoc(produtoRef, updates);

    // Mostra mensagem de sucesso
    msgStatus.textContent = "✅ Produto atualizado com sucesso!";

    // Redireciona para a página do vendedor após pequena pausa
    setTimeout(() => {
      window.location.href = `vendedor.html?id=${usuarioLogado.uid}`;
    }, 900);
  } catch (error) {
    // Exibe erro, caso ocorra algum problema
    console.error("Erro ao atualizar produto:", error);
    msgStatus.textContent = "❌ Erro: " + error.message;
  }
});
