const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "proyectofinalmodulo8adl",
    allowExitOnIdle: true
})
const getUsers = async () => {
    const query = "SELECT * FROM users"
    const { rows: users } = await pool.query(query)
    return users
}

const getProducts = async () => {
    const query = " select * from productos"
    const { rows: productos } = await pool.query(query)
    return productos
}

const getProduct = async (id) => {
    const query = " select * from productos where id = $1"
    const value = [id]
    const { rows: productos } = await pool.query(query, value)
    return productos
}

const deleteProduct = async(id) =>{
    const query = " delete from productos where id = $1"
    const values = [id]
    const result = await pool.query(query, values)
}

const addProduct = async ({ nombre, precio,imagen }) => {
    const values = [nombre, precio,imagen]
    const query = "insert into productos values(DEFAULT, $1, $2, $3)"
    await pool.query(query, values)
}

const registerUser = async (user) => {
    let { nombre, email, password, telefono, direccion_de_envio_por_default } = user
    const encriptedPassword = bcrypt.hashSync(password)
    password = encriptedPassword
    const values = [nombre, email, password, telefono, direccion_de_envio_por_default]
    const query = "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, $5)"
    await pool.query(query, values)
}

const checkCredentials = async (email, password) => {
    const values = [email]
    const query = "SELECT * FROM users WHERE email = $1"    
    const { rows: [usuario], rowCount } = await pool.query(query, values)
    const { password: encriptedPassword } = usuario   
    const correctPassword = bcrypt.compareSync(password, encriptedPassword)    
     if (!correctPassword || !rowCount)
        throw { code: 401, message: "Email or Password Incorrect =)!!" }
}

const reportQuery = async (req, res, next) => {
    const par = req.params
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Hemos Recibido una Consulta en la Ruta ${url}
    con los Parámetros:
    `, par)
    next()
}
module.exports = { getProducts, addProduct, deleteProduct, getProduct, registerUser, checkCredentials, reportQuery, getUsers }