# API-DEVTOOLS

### Technologies utilisées

Cette API REST fonctionne avec Docker, NodeJS et minio qui est un service de S3 gratuit.

### Fonctionnalités

Les fichiers de l'API se transmettent directement à la machine qui va gérer la partie NodeJS.

Toutes les routes demandées ont été faites.

```
delete : localhost:3000/books/{isbn}
create : locahost:3000/books
update (patch) : localhost:3000/books/{isbn}
getAll : localhost:3000/books
getByIsbn : localhost:3000/books/{isbn}
```

### Fonctionnement

Dans le cas ou vous souhaitez utliser le service S3 minio, il faut que vous déplaciez l'image dans le répertoire ``/nodeDocker/src/pictures``.
Elles seront naturellements ajoutées au conteneur Node pour pouvoir s'en servir ensuite.

#### Ports d'écoutes

```
Minio : 
        port 9000 pour l'api
        port 9001 pour la console
              - username : minio
              - password : minio123
API :
        port 3000

MySQL :
        port 3306
```
