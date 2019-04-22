# Siret invader 

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
