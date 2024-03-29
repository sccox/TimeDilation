let express = require('express');
let app = express();
let path = require('path');
let bodyParser = require('body-parser');
let knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./captcha.db"
    },
    useNullAsDefault: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));


app.set('view engine', 'ejs');

app.get('/database', (req, res) =>
     knex.select('*').from('Main')
    .orderBy('userID').then(mainRec => {
        res.render('index', {
            mainData: mainRec
        })
    })
);

//this is the directory that the application will point to for files
app.use(express.static(path.join(__dirname, 'capTests')));


app.post('/DeleteMain/:id', (req, res) => {
    knex('Main').where('userID', req.params.id).del().then(mainRec => {
        res.redirect("/database");
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });
});

app.get('/', (req, res) => {
    knex.select('userID').from('Main').orderBy('userID', 'desc').then(mainRec => {
        res.render('startPage', {
            mainData: mainRec
        })
    })
});

app.get('/thankyou', (req, res) => {
        res.render('thankyou', {
        })
    });

app.get('/addMain', (req, res) => {
    knex.select('userID').from('Main').orderBy('userID', 'desc').then(mainRec => {
        res.render('addMain', {
            mainData: mainRec
        })
    })
});


app.post('/captchaStart', (req, res) => {
    let d = new Date();
    let setStart = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
    + "-" + d.getHours() + "." + d.getMinutes() + "." + d.getSeconds();
    knex('Main').insert({startTime: setStart}).then(main => {
        res.redirect('/addMain');
    });
});


app.get('/finalForm/:id', function(req, res) {
    knex.select('userID').from('Main').orderBy('userID', 'desc').then(mainRec => {
        res.render('finalForm', {
            mainData: mainRec
        })
    })
  });


  app.post('/finalFormSubmit/:id', (req, res) => 
  {
        let d = new Date();
        let setEnd = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
        + "-" + d.getHours() + "." + d.getMinutes() + "." + d.getSeconds();
      knex('Main')
          .where('userID', req.params.id)
          .update({
            endTime: setEnd,
            timeFeel: req.body.timeFeel,
            timeFeelEstimate: req.body.timeFeelEstimate,
            lostInterest: req.body.lostInterest, 
            musicAffect: req.body.musicAffect, 
            volume: req.body.volume,
            repetitive: req.body.repetitive, 
            motivating: req.body.motivating, 
            engaging: req.body.engaging,
            distraction: req.body.distraction, 
            enjoyment: req.body.enjoyment, 
            anxiety: req.body.anxiety, 
            challenge: req.body.challenge,
            comfort: req.body.comfort, 
            recentExp: req.body.recentExp, 
            timePressure: req.body.timePressure, 
            timeAwareness: req.body.timeAwareness, 
            emotion: req.body.emotion, 
            educationLevel: req.body.educationLevel, 
            maritalStatus: req.body.maritalStatus, 
            gender: req.body.gender, 
            age: req.body.age,
            byuID: req.body.byuID,
            feedback: req.body.feedback
          })
          .then
      (
          mainData => 
          {
              res.redirect('/thankyou');
              
          }
      )
  }   
);

app.get('/UpdateMain/:id', (req, res) => {
    knex.select("*").from('Main').where('userID', req.params.id).then(mainRec => {
        res.render("UpdateMain", {
            mainData: mainRec
        });
    });
});


//update and redirect to thankyou page
app.post('/UpdateMain/:id', (req, res) => 
        {
            
            knex('Main')
                .where('userID', req.params.id)
                //.update(req.body)
                .update({
                    leverTested: req.body.leverTested,
                    finishEarly: req.body.finishEarly,
                    typeChange: req.body.typeChange, 
                    allA: req.body.allA, 
                    allC: req.body.allC, 
                    labelA: req.body.labelA, 
                    labelC: req.body.labelC, 
                    findWrongA: req.body.findWrongA, 
                    findWrongC: req.body.findWrongC,
                    typeWordsA: req.body.typeWordsA, 
                    typeWordsC: req.body.typeWordsC, 
                    findImageA: req.body.findImageA, 
                    findImageC: req.body.findImageC,
                    wrongWordA: req.body.wrongWordA, 
                    wrongWordC: req.body.wrongWordC,
                    descOthersA: req.body.descOthersA,
                    descOthersC: req.body.descOthersC,
                    connectsA: req.body.connectsA,
                    connectsC: req.body.connectsC,
                    belongsA: req.body.belongsA,
                    belongsC: req.body.belongsC,
                    specificA: req.body.specificA,
                    specificC: req.body.specificC,
                    noPatternA: req.body.noPatternA,
                    noPatternC: req.body.noPatternC,
                    findPatternA: req.body.findPatternA, 
                    findPatternC: req.body.findPatternC, 
                    finishWordA: req.body.finishWordA,
                    finishWordC: req.body.finishWordC,
                    avgResTime: req.body.avgResTime, 
                    timeEstimate: req.body.timeEstimate,
                    musicPlayed: req.body.musicPlayed
                })
                .then
            (
                mainData => 
                {
                    res.redirect('/finalForm/:' + req.params.id);
                    
                }
            )
        }   
    );






//app.listen(port, () => console.log("Server running."));
app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});