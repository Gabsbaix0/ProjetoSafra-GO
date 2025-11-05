// js/produto-editar.js
import { auth, db, storage } from "../js/firebaseConfig.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  ref as storageRef, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

const form = document.getElementById("formEditarProduto");
const msgStatus = document.getElementById("msgStatus");
const previewImagem = document.getElementById("previewImagem");

let produtoData = null;
let usuarioLogado = null;

onAuthStateChanged(auth, async (user) => {
  usuarioLogado = user;
  if (!user) {
    alert("Você precisa estar logado para editar um produto.");
    window.location.href = "login.html";
    return;
  }
  if (produtoId) await carregarProduto();
});

async function carregarProduto() {
  try {
    const produtoRef = doc(db, "produtos", produtoId);
    const produtoSnap = await getDoc(produtoRef);

    if (!produtoSnap.exists()) {
      alert("Produto não encontrado.");
      return;
    }

    produtoData = produtoSnap.data();

    // Verifica permissão: apenas o vendedor dono pode editar
    if (produtoData.vendedorId !== usuarioLogado.uid) {
      alert("Você não tem permissão para editar este produto.");
      window.location.href = `vendedor.html?id=${produtoData.vendedorId}`;
      return;
    }

    // Preenche formulário
    document.getElementById("nome").value = produtoData.nome || "";
    document.getElementById("descricao").value = produtoData.descricao || "";
    document.getElementById("preco").value = produtoData.preco || "";
    document.getElementById("categoria").value = produtoData.categoria || "";
    document.getElementById("quantidade").value = produtoData.quantidade || 1;

    if (produtoData.imagemUrl) {
      previewImagem.innerHTML = `<img src="${produtoData.imagemUrl}" alt="Preview" style="width:180px;border-radius:8px;">`;
    }
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    alert("Erro ao carregar produto.");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgStatus.textContent = "Salvando alterações...";

  try {
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const categoria = document.getElementById("categoria").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const imagemFile = document.getElementById("imagem").files[0];

    const produtoRef = doc(db, "produtos", produtoId);

    const updates = {
      nome, descricao, preco, categoria, quantidade
    };

    // Se uma nova imagem foi enviada, envia para Storage, atualiza imagemUrl e imagemPath
    if (imagemFile) {
      // opcional: apaga imagem antiga (se houver imagemPath)
      if (produtoData && produtoData.imagemPath) {
        try {
          const oldRef = storageRef(storage, produtoData.imagemPath);
          await deleteObject(oldRef);
        } catch (err) {
          console.warn("Não foi possível apagar imagem antiga:", err.message);
        }
      }

      const caminho = `produtos/${usuarioLogado.uid}/${Date.now()}_${imagemFile.name}`;
      const stRef = storageRef(storage, caminho);
      await uploadBytes(stRef, imagemFile);
      const imagemUrl = await getDownloadURL(stRef);

      updates.imagemUrl = imagemUrl;
      updates.imagemPath = caminho;
    }

    await updateDoc(produtoRef, updates);

    msgStatus.textContent = "✅ Produto atualizado com sucesso!";
    setTimeout(() => {
      window.location.href = `vendedor.html?id=${usuarioLogado.uid}`;
    }, 900);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    msgStatus.textContent = "❌ Erro: " + error.message;
  }
});
