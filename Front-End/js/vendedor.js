// js/vendedor.js
import { auth, db, storage } from "../js/firebaseConfig.js";
import {
  doc, getDoc, collection, query, where, getDocs, deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  ref as storageRef, deleteObject
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const params = new URLSearchParams(window.location.search);
const vendedorId = params.get("id");

const nomeVendedor = document.getElementById("nomeVendedor");
const emailVendedor = document.getElementById("emailVendedor");
const telefoneVendedor = document.getElementById("telefoneVendedor");
const enderecoVendedor = document.getElementById("enderecoVendedor");
const fotoVendedor = document.getElementById("fotoVendedor");
const listaProdutos = document.getElementById("listaProdutos");

let usuarioLogado = null;

onAuthStateChanged(auth, (user) => {
  usuarioLogado = user;
  // se o vendedor já estiver carregado, re-renderiza produtos para mostrar botões
  if (vendedorId) carregarVendedor().then(() => carregarProdutos());
});

async function carregarVendedor() {
  try {
    const vendedorRef = doc(db, "vendedores", vendedorId);
    const vendedorSnap = await getDoc(vendedorRef);

    if (vendedorSnap.exists()) {
      const dados = vendedorSnap.data();
      nomeVendedor.textContent = dados.nome || "Sem nome";
      emailVendedor.textContent = dados.email || "Não informado";
      telefoneVendedor.textContent = dados.telefone || "Não informado";
      enderecoVendedor.textContent = dados.endereco || "Não informado";
      if (dados.fotoUrl) fotoVendedor.src = dados.fotoUrl;
    } else {
      nomeVendedor.textContent = "Vendedor não encontrado.";
    }
  } catch (error) {
    console.error("Erro ao carregar vendedor:", error);
    nomeVendedor.textContent = "Erro ao carregar vendedor.";
  }
}

async function carregarProdutos() {
  try {
    const produtosRef = collection(db, "produtos");
    const q = query(produtosRef, where("vendedorId", "==", vendedorId));
    const querySnapshot = await getDocs(q);

    listaProdutos.innerHTML = "";

    if (querySnapshot.empty) {
      listaProdutos.innerHTML = "<p>Este vendedor ainda não possui produtos cadastrados.</p>";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const produto = docSnap.data();
      const produtoId = docSnap.id;

      const card = document.createElement("div");
      card.classList.add("card-produto");

      // Monta conteúdo base do card
      card.innerHTML = `
        <img src="${produto.imagemUrl || 'img/produto-default.png'}" alt="${produto.nome}">
        <h4>${produto.nome}</h4>
        <p>R$ ${produto.preco ? produto.preco.toFixed(2) : '---'}</p>
        <div class="acoes-produto">
          <a class="btn-detalhes" href="produto.html?id=${produtoId}">Ver detalhes</a>
        </div>
      `;

      // Se o usuário logado é o vendedor, mostra editar/remover
      if (usuarioLogado && usuarioLogado.uid === vendedorId) {
        const acoes = card.querySelector(".acoes-produto");
        const btnEditar = document.createElement("a");
        btnEditar.textContent = "Editar";
        btnEditar.href = `produto-editar.html?id=${produtoId}`;
        btnEditar.classList.add("btn-editar");

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.classList.add("btn-remover");
        btnRemover.addEventListener("click", () => confirmarRemocao(produtoId, produto));

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnRemover);
      }

      listaProdutos.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    listaProdutos.innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
}

async function confirmarRemocao(produtoId, produtoData) {
  const confirma = confirm(`Tem certeza que deseja remover o produto "${produtoData.nome}"? Esta ação é irreversível.`);
  if (!confirma) return;

  try {
    // 1) Apaga documento no Firestore
    await deleteDoc(doc(db, "produtos", produtoId));

    // 2) Apaga imagem no Storage (se houver campo imagemPath salvo)
    if (produtoData.imagemPath) {
      try {
        const imgRef = storageRef(storage, produtoData.imagemPath);
        await deleteObject(imgRef);
        console.log("Imagem do Storage removida.");
      } catch (err) {
        console.warn("Não foi possível remover a imagem no Storage:", err.message);
        // não interrompe a remoção do doc — só logamos
      }
    } else {
      // Se não existir imagemPath, apenas logamos: (recomendamos migrar/atualizar)
      console.warn("Produto não possui imagemPath; nenhuma imagem foi removida no Storage.");
    }

    // remove card da UI
    carregarProdutos();
    alert("Produto removido com sucesso.");
  } catch (error) {
    console.error("Erro ao remover produto:", error);
    alert("Erro ao remover produto: " + error.message);
  }
}

// Inicializa se tiver id
if (!vendedorId) {
  nomeVendedor.textContent = "Vendedor não especificado.";
} else {
  // se não houver usuário logado ainda, carregarVendedor será chamado no onAuthStateChanged acima
  // mas chamamos aqui para garantir carregamento mínimo (caso não seja necessário autenticação)
  carregarVendedor().then(() => carregarProdutos());
}
