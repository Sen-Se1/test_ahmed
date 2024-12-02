const express = require("express");
const path = require("path");
const mysql = require("mysql");
const hbs = require("express-hbs");
const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "foot"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connexion réussie");
});

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts',
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/list', (req, res) => {
    let sql = "SELECT * FROM equipe";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('list', {
            title: 'List Page',
            layout: 'main',
            continu: result
        });
    });

});

app.get('/add', (req, res) => {
    res.render('add', {
        title: 'Add Page',
        layout: 'main'
    });
});

app.post('/add', (req, res) => {
    let { nom, numero, role, photo } = req.body;
    let sql = "INSERT INTO equipe (nom, numero, role, photo) VALUES (?, ?, ?, ?)";

    connection.query(sql, [nom, numero, role, photo], (err, result) => {
        if (err) throw err;
        res.render('add', {
            title: 'Add Page',
            layout: 'main',
            message: 'Added successfully '
        });
    });

});


app.listen(port, () => {
    console.log(`Application exécutée sur http://localhost:${port}`);
});