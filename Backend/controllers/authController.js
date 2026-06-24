const usuariosDB = [{ user: "admin", pass: "12345" }];

function login(req, res) {
    const { usuario, password } = req.body;
    const user = usuariosDB.find(u => u.user === usuario && u.pass === password);
    
    if (user) {
        return res.status(200).json({ mensaje: "Acceso concedido", status: 200 });
    }
    return res.status(401).json({ mensaje: "Credenciales incorrectas", status: 401 });
}
module.exports = { login };