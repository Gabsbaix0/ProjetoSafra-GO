const jwt = require('jsonwebtoken'); // npm install jsonwebtoken
const JWT_SECRET = 'seu_segredo_super_secreto_aqui'; // O MESMO SEGREDO

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (token == null) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
        }
        
        // Salva os dados do usuário (do token) na requisição
        // para que a próxima rota possa usá-los
        req.usuario = userPayload; 
        next(); // Passa para a rota principal
    });
};

module.exports = authenticateToken;