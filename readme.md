# Siret invader 

Insert mass data in MongoDB with bulk and pm2 as process manager.

## CLI helper

| Command | Action |
| --- | --- |
| npm run start-db | Start MongoDB |
| npm run prepare | Prepare tiny files before main script |
| npm run start | Start index process |
| npm run stop | Stop index process |
| npm run restart | Restart index process |
| npm run eslint | Run eslint (source folder) |


## Step 1 - Get project
```
# Clone the project
git clone https://github.com/musps/siret-invader.git

# Move inside
cd siret-invader

# Install dependencies
npm install
```

## Step 2 - Download data

* Download the following file : [StockEtablissement_utf8.zip](https://www.data.gouv.fr/fr/datasets/r/7e73e851-3b07-45e6-a29a-506733eafb2d)
* Unzip it and move it inside the project location.

## Step 3 - Config variables
* You need define the those variables.
```
# ./env

# Main csv file path. (step 2)
CSV_PATH=./StockEtablissement_utf8.csv

# MongoDB connection string.
DB_PATHH=mongodb://localhost:27017/SiretInvader
```

## Step 4 - Start process

When everything is setup  correctly you can start the index process.
First you need prepare your big csv file and make it smaller.

* Run `npm run prepare` 

When it's done you can start you MongoDB

* Run `npm run start-db`

Then you can start the main script (indexation process).

* Run `npm run start`
Whenever you need to pause your script run `npm run start` then `npm run restart` when you feel free to continue.

At the end all pm2 process while fade out (killed).