import { auth, storage, db } from "../js/firebaseConfig.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  addDoc, collection, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const formProduto = document.getElementById("formProduto");
const msgStatus = document.getElementById("msgStatus");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    formProduto.addEventListener("submit", async (e) => {
      e.preventDefault();
      msgStatus.textContent = "Enviando produto...";

      try {
        const nome = document.getElementById("nome").value;
        const descricao = document.getElementById("descricao").value;
        const preco = parseFloat(document.getElementById("preco").value);
        const categoria = document.getElementById("categoria").value;
        const quantidade = parseInt(document.getElementById("quantidade").value);
        const imagemFile = document.getElementById("imagem").files[0];

        // 🔥 Gera um nome único para o arquivo
        const caminho = `produtos/${user.uid}/${Date.now()}_${imagemFile.name}`;

        // Envia imagem para o Firebase Storage
        const storageRefPath = ref(storage, caminho);
        await uploadBytes(storageRefPath, imagemFile);

        // Pega URL pública da imagem
        const imagemUrl = await getDownloadURL(storageRefPath);

        // Salva produto no Firestore
        await addDoc(collection(db, "produtos"), {
          nome,
          descricao,
          preco,
          categoria,
          quantidade,
          imagemUrl,
          imagemPath: caminho, // ✅ salva o caminho também
          vendedorId: user.uid,
          criadoEm: serverTimestamp(),
        });

        msgStatus.textContent = "✅ Produto cadastrado com sucesso!";
        formProduto.reset();
      } catch (error) {
        console.error(error);
        msgStatus.textContent = "❌ Erro ao cadastrar produto: " + error.message;
      }
    });
  }
});
