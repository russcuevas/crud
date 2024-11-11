const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    db.query('SELECT * FROM schedule ORDER BY date DESC', (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        res.render('index', { schedules: rows });
    });
});

app.post('/add-schedule', (req, res) => {
    const { date, time, location } = req.body;
    const query = 'INSERT INTO schedule (date, time, location) VALUES (?, ?, ?)';

    db.query(query, [date, time, location], (err, result) => {
        if (err) {
            console.log(err);
            return res.redirect('/?status=error');
        }
        res.redirect('/?success_add=true');
    });
});

app.get('/delete/:id', (req, res) => {
    const scheduleId = req.params.id;
    const query = 'DELETE FROM schedule WHERE id = ?';
    db.query(query, [scheduleId], (err, result) => {
        if (err) {
            console.log(err);
            return res.redirect('/?status=error');
        }
        res.redirect('/?success_delete=true');
    });
});

app.post('/update/:id', (req, res) => {
    const scheduleId = req.params.id;
    const { date, time, location } = req.body;
    const query = 'UPDATE schedule SET date = ?, time = ?, location = ? WHERE id = ?';

    db.query(query, [date, time, location, scheduleId], (err, result) => {
        if (err) {
            console.log(err);
            return res.redirect('/?status=error');
        }
        res.redirect('/?success_update=true');
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
