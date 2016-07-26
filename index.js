#! /usr/bin/env node
'use strict';

const program = require("commander");
const fs = require("fs");
const mongo   = require("./lib/mongo");

const opts    = ['port', 'host', 'user', 'password', 'database', 'output', 'input'];
const config = {};

program
  .version('1.0.1')
  .option('-P, --port [dbport]', 'Informa a porta do banco de dados')
  .option('-h, --host [dbdomain]', 'Informa o host do banco de dados')
  .option('-u, --username [dbuser]', 'Informa o usuario do banco de dados')
  .option('-p, --password [dbpass]', 'Informa a senha do banco de dados')
  .option('-d, --database [db]', 'Informa o nome do banco de dados')
  .option('-o, --output <file>', "Exporta os dados para um arquivo")
  .option('-i, --input <file>', "Importa os dados de um arquivo")
  .option('-c, --collection [name]', "Seleciona o nome da collection")
  .parse(process.argv)

for(let opt of opts){
  if(program[opt] && program[opt] !== true){
    config[opt] = program[opt]
  }
}

if(program.collection === undefined){
  console.log("mongo-cabra -c [collection-name]");
  process.exit(2);
}

if( (program.input === undefined) && (program.output === undefined) ){
  console.log("mongo-cabra -i <input-file>");
  console.log("or");
  console.log("mongo-cabra -o <output-file>");
  process.exit(2);
}

mongo(config, function(err, db){
  if(err){
    console.log(err);
    process.exit(3);
  }
  db.collection(program.collection,function(err, collection){

    if(err){
      console.log(err);
      process.exit(3);
    }

    if(program.output){

      return collection.find().toArray((err, data) => {
        if(err){
          console.log(err);
          process.exit(4);
        }
        fs.writeFileSync(program.output, JSON.stringify(data));
        process.exit(1)
      })

    }

    let data = fs.readFileSync(program.input);

    collection.insert(JSON.parse(data),(err, result) => {
      if(err){
        console.log(err);
        process.exit(4);
      }
      console.log(`Inserted ${result.insertedCount} entries in MongoDB`);
      process.exit(1)
    })

  })
});
