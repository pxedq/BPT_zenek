import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());
app.use(cors());

const con = await mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "zenek",
  user: "root",
  password: ""
});

async function getZenek(req, res) {
    try {
        let sql = "select * from zenek order by cim";
        const [ json ] = await con.query(sql);
        res.send(json);
    } catch(err) { res.status(500).send({ error:"Szerver hiba!" }); }
}

async function postZene(req, res) {
    let { eloado, cim, hossz } = req.body;
    if (eloado && cim && hossz) {
        try {
            let sql = "insert into zenek set eloado=?, cim=?, hossz=?";
            const [ json ] = await con.query(sql, [eloado, cim, hossz]);
            res.status(201).send({ status:"OK" });
        } catch(err) { res.status(500).send({ error:"Szerver hiba!" }); }
    } else res.status(400).send({ error:"Hibás paraméter!"});
}

async function putZene(req, res) {
    let { id } = req.params;
    let { eloado, cim, hossz } = req.body;
    if (eloado && cim && hossz) {
        try {
            let sql = "update zenek set eloado=?, cim=?, hossz=? where id=?";
            const [ json ] = await con.query(sql, [eloado, cim, hossz, id]);
            if (json.affectedRows != 0) res.send({ status:"OK" });
            else res.status(404).send({ error:"Nincs ilyen!" });
        } catch(err) { res.status(500).send({ error:"Szerver hiba!" }); }
    } else res.status(400).send({ error:"Hibás paraméter!"});
}

async function deleteZene(req, res) {
    let { id } = req.params;
    try {
        let sql = "delete from zenek where id=?";
        const [ json ] = await con.query(sql, [id]);
        if (json.affectedRows != 0) res.send({ status:"OK" });
        else res.status(404).send({ error:"Nincs ilyen!" });
    } catch(err) { res.status(500).send({ error:"Szerver hiba!" }); }
}

app.get("/", (req, res) => res.send("<h1>Zenék v1.0.0</h1>"));
app.get("/zenek", getZenek);
app.post("/zene", postZene);
app.put("/zene/:id", putZene);
app.delete("/zene/:id", deleteZene);

app.listen(88, err => console.log(err ? err : "Server on #88"));